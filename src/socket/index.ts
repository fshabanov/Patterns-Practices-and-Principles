import { Server } from "socket.io";
import { Events, User } from "../@types";
import { roomProgress, users } from "../state";
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

let rooms: string[] = [];

export default (io: Server) => {
	io.on("connection", (socket) => {
		const username = socket.handshake.query.username as string;
		if (io.sockets.sockets.has(username)) {
			socket.emit(Events.USER_EXISTS, { message: "Username already exists" });
			socket.disconnect();
			return;
		}
		io.sockets.sockets.set(username, socket);
		users.set(socket.id, {
			username,
			isReady: false,
			progress: 0,
			accuracy: 0,
			wpm: 0,
			socketId: socket.id,
		});

		console.log(`${username} connected`);

		getAllRooms(io, socket, rooms);

		createRoom(io, socket, rooms);

		socket.on(Events.JOIN_ROOM, (roomName) => {
			if (getRoomUsers(io, roomName)?.has(socket.id)) return;
			if (
				(getRoomUsers(io, roomName)?.size || 0) >=
				config.MAXIMUM_USERS_FOR_ONE_ROOM
			) {
				socket.emit(Events.ERROR, {
					message: "Room is full",
				});
				return;
			}
			socket.join(roomName);
			io.emit(Events.UPDATE_ROOMS, {
				name: roomName,
				numberOfUsers: getRoomUsers(io, roomName)?.size || 0,
			});
			joinRoom(io, socket, roomName);
		});

		socket.on(Events.LEAVE_ROOM, (roomName) => {
			rooms = leaveRoom(io, socket, roomName, rooms);
			startTimer(io, roomName);
		});

		socket.on(
			Events.USER_READY,
			(data: { roomName: string; isReady: boolean }): void => {
				userReady(io, socket, data.isReady, data.roomName);
			}
		);

		socket.on(Events.CHANGE_PROGRESS, ({ progress, accuracy, wpm }) => {
			users.set(socket.id, {
				...users.get(socket.id),
				progress,
				accuracy,
				wpm,
			} as User);

			const roomName = getRoomName(socket);

			if (progress === 100) {
				if (!roomProgress[roomName]) {
					roomProgress[roomName] = new Set<string>();
				}
				roomProgress[roomName].add(socket.id);
			}
			io.to(roomName).emit(Events.CHANGE_PROGRESS, {
				...users.get(socket.id),
			});
			const roomUsers = getRoomUsers(io, roomName);
			if (roomProgress[roomName].size === roomUsers?.size) {
				endGame(io, socket, true);
			}
		});

		socket.on(Events.END_GAME, () => {
			endGame(io, socket);
		});

		socket.on("disconnecting", () => {
			const connectedRooms = Array.from(socket.rooms).slice(1);
			connectedRooms.forEach((room) => {
				rooms = leaveRoom(io, socket, room, rooms);
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
