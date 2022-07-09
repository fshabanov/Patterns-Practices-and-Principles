import { Server } from "socket.io";
import { Events, User } from "../@types";
import * as config from "./config";
import createRoom from "./createRoom";
import getAllRooms from "./getAllRooms";
import joinRoom from "./joinRoom";
import leaveRoom from "./leaveRoom";
import startTimer from "./startTimer";

let rooms: string[] = [];

const users = new Map<string, User>();

export default (io: Server) => {
	io.on("connection", (socket) => {
		const username = socket.handshake.query.username as string;
		if (io.sockets.sockets.has(username)) {
			socket.emit(Events.USER_EXISTS, { message: "Username already exists" });
			socket.disconnect();
			return;
		}
		io.sockets.sockets.set(username, socket);
		users.set(socket.id, { username, isReady: false, progress: 0 });

		console.log(`${username} connected`);

		getAllRooms(io, socket, rooms, users);

		createRoom(io, socket, rooms, users);

		socket.on(Events.JOIN_ROOM, (roomName) => {
			if (io.sockets.adapter.rooms.get(roomName)?.has(socket.id)) return;
			if (
				(io.sockets.adapter.rooms.get(roomName)?.size || 0) >=
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
				numberOfUsers: io.sockets.adapter.rooms.get(roomName)?.size || 0,
			});
			joinRoom(io, socket, roomName, users);
		});

		socket.on(Events.LEAVE_ROOM, (roomName) => {
			rooms = leaveRoom(io, socket, roomName, rooms, users);
			startTimer(io, users, roomName);
		});

		socket.on(
			Events.USER_READY,
			(data: { roomName: string; isReady: boolean }): void => {
				users.set(socket.id, {
					...users.get(socket.id),
					isReady: data.isReady,
				} as User);
				io.to(data.roomName).emit(Events.USER_READY, {
					...users.get(socket.id),
				});
				startTimer(io, users, data.roomName);
			}
		);

		socket.on(Events.CHANGE_PROGRESS, ({ progress, roomName }) => {
			users.set(socket.id, {
				...users.get(socket.id),
				progress,
			} as User);
			io.to(roomName).emit(Events.CHANGE_PROGRESS, {
				...users.get(socket.id),
			});
		});

		socket.on("disconnecting", () => {
			const connectedRooms = Array.from(socket.rooms).slice(1);
			connectedRooms.forEach((room) => {
				rooms = leaveRoom(io, socket, room, rooms, users);
			});
			users.delete(socket.id);
		});

		socket.on("disconnect", () => {
			console.log(`${username} disconnected`);
			io.sockets.sockets.delete(username);
		});
	});
};
