import { Server } from "socket.io";
import { Events, User } from "../@types";
import { roomProgress, setRooms, users } from "../state";
import getRoomName from "../helpers/getRoomName";
import getRoomUsers from "../helpers/getRoomUsers";
import * as config from "./config";
import createRoom from "./createRoom";
import endGame from "./endGame";
import getAllRooms from "./getAllRooms";
import joinRoom from "./joinRoom";
import leaveRoom from "./leaveRoom";
import startTimer from "./startTimer";
import userReady from "./userReady";
import connectUser from "./connectUser";

export default (io: Server) => {
	io.on("connection", (socket) => {
		const username = socket.handshake.query.username as string;

		connectUser(io, socket, username);

		getAllRooms(io, socket);

		createRoom(io, socket);

		socket.on(Events.JOIN_ROOM, (roomName) => {
			const roomUsers = getRoomUsers(io, roomName);
			if (roomUsers?.has(socket.id)) return;
			if ((roomUsers?.size || 0) >= config.MAXIMUM_USERS_FOR_ONE_ROOM) {
				socket.emit(Events.ERROR, {
					message: "Room is full",
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
			joinRoom(io, socket, roomName);
		});

		socket.on(Events.LEAVE_ROOM, (roomName) => {
			setRooms(leaveRoom(io, socket, roomName));
			startTimer(io, roomName);
		});

		socket.on(
			Events.USER_READY,
			(data: { roomName: string; isReady: boolean }): void => {
				userReady(io, socket, data.isReady, data.roomName);
			}
		);

		socket.on(
			Events.CHANGE_PROGRESS,
			(data: { progress?: number; wpm: number; accuracy: number }) => {
				users.set(socket.id, {
					...users.get(socket.id),
					...data,
				} as User);

				const roomName = getRoomName(socket);

				if (data.progress === 100) {
					if (!roomProgress[roomName]) {
						roomProgress[roomName] = new Set<string>();
					}
					roomProgress[roomName].add(socket.id);
				}
				io.to(roomName).emit(Events.CHANGE_PROGRESS, {
					...users.get(socket.id),
				});
				const roomUsers = getRoomUsers(io, roomName);
				// If all users are finished, end the game
				if (roomProgress[roomName].size === roomUsers?.size) {
					endGame(io, socket, true);
				}
			}
		);

		socket.on(Events.END_GAME, () => {
			endGame(io, socket);
		});

		socket.on("disconnecting", () => {
			const connectedRooms = Array.from(socket.rooms).slice(1);
			connectedRooms.forEach((room) => {
				setRooms(leaveRoom(io, socket, room));
				startTimer(io, room);
			});
			users.delete(socket.id);
		});

		socket.on("disconnect", () => {
			console.log(`${username} disconnected`);
			io.sockets.sockets.delete(username);
		});
	});
};
