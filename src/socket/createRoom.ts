import { Server, Socket } from "socket.io";
import { Events } from "../@types";
import getRoomUsers from "../helpers/getRoomUsers";
import { rooms } from "../state";
import joinRoom from "./joinRoom";

function createRoom(io: Server, socket: Socket): void {
	socket.on(Events.CREATE_ROOM, (roomName: string) => {
		if (io.sockets.adapter.rooms.has(roomName)) {
			socket.emit(Events.ERROR, {
				message: "Room with this name already exists",
			});
			return;
		}
		rooms.push(roomName);
		socket.join(roomName);

		io.emit(Events.CREATE_ROOM, {
			name: roomName,
			numberOfUsers: getRoomUsers(io, roomName)?.size || 0,
		});
		joinRoom(io, socket, roomName);
	});
}

export default createRoom;
