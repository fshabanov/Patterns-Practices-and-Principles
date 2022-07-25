import { Server } from 'socket.io';
import { Events, User } from '../@types';
import getRoomName from '../helpers/getRoomName';
import getRoomUsers from '../helpers/getRoomUsers';
import * as config from './config';
import createRoom from './createRoom';
import endGame from './endGame';
import getAllRooms from './getAllRooms';
import joinRoom from './joinRoom';
import leaveRoom from './leaveRoom';
import startTimer from './startTimer';
import userReady from './userReady';
import connectUser from './connectUser';
import { state } from '../state/state';

export default (io: Server) => {
	state.io = io;
	io.on('connection', (socket) => {
		const username = socket.handshake.query.username as string;
		const device = socket.handshake.query.device as string;

		connectUser(socket, username, device);

		getAllRooms(socket);

		createRoom(socket);

		socket.on(Events.JOIN_ROOM, (roomName) => {
			const roomUsers = getRoomUsers(roomName);
			if (roomUsers?.has(socket.id)) return;
			if ((roomUsers?.size || 0) >= config.MAXIMUM_USERS_FOR_ONE_ROOM) {
				socket.emit(Events.ERROR, {
					message: 'Room is full',
				});
				return;
			}
			socket.join(roomName);
			roomUsers?.add(socket.id);
			const numOfUsers = roomUsers?.size || 0;
			if (numOfUsers >= config.MAXIMUM_USERS_FOR_ONE_ROOM) {
				io.emit(Events.REMOVE_ROOM, {
					name: roomName,
				});
			} else {
				io.emit(Events.UPDATE_ROOMS, {
					name: roomName,
					numberOfUsers: roomUsers?.size || 0,
				});
			}
			joinRoom(socket, roomName);
		});

		socket.on(Events.LEAVE_ROOM, (roomName) => {
			state.rooms = leaveRoom(socket, roomName);
			startTimer(roomName);
		});

		socket.on(
			Events.USER_READY,
			(data: { roomName: string; isReady: boolean }): void => {
				userReady(socket, data.isReady, data.roomName);
			}
		);

		socket.on(
			Events.CHANGE_PROGRESS,
			(data: {
				progress?: number;
				wpm: number;
				accuracy: number;
				timeUsed: number;
			}) => {
				const user = state.users.get(socket.id) as User;
				state.users.set(socket.id, {
					...user,
					...data,
				});

				const roomName = getRoomName(socket);

				if (data.progress === 100) {
					if (!state.roomProgress[roomName]) {
						state.roomProgress[roomName] = new Map<string, number>();
					}
					state.roomProgress[roomName].set(socket.id, data.timeUsed);
					const commentSender = state.getRoomCommentator(roomName);
					commentSender.userFinished(user);
				}
				io.to(roomName).emit(Events.CHANGE_PROGRESS, {
					...user,
				});
				const roomUsers = getRoomUsers(roomName);
				// If all users are finished, end the game
				if (state.roomProgress[roomName].size === roomUsers?.size) {
					endGame(socket, true);
				}
			}
		);

		socket.on(Events.REPORT_STATUS, () => {
			const roomName = getRoomName(socket);
			const commentSender = state.getRoomCommentator(roomName);
			commentSender.reportStatus();
		});

		socket.on(Events.USER_NEAR, () => {
			const roomName = getRoomName(socket);
			const user = state.users.get(socket.id) as User;
			const commentSender = state.getRoomCommentator(roomName);
			commentSender.userNear(user);
		});

		socket.on(Events.RANDOM_DATA, () => {
			const roomName = getRoomName(socket);
			const commentSender = state.getRoomCommentator(roomName);
			commentSender?.randomText();
		});

		socket.on(Events.END_GAME, () => {
			endGame(socket);
		});

		socket.on('disconnecting', () => {
			const connectedRooms = Array.from(socket.rooms).slice(1);
			connectedRooms.forEach((room) => {
				state.rooms = leaveRoom(socket, room);
				startTimer(room);
			});
			state.users.delete(socket.id);
		});

		socket.on('disconnect', () => {
			console.log(`${username} disconnected`);
			io.sockets.sockets.delete(username);
		});
	});
};
