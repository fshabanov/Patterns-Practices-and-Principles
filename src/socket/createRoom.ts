import { Server, Socket } from "socket.io";
import { Events, User } from "../@types";
import joinRoom from "./joinRoom";

function createRoom(
	io: Server,
	socket: Socket,
	rooms: string[],
	users: Map<string, User>
): void {
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
			numberOfUsers: io.sockets.adapter.rooms.get(roomName)?.size || 0,
		});
		joinRoom(io, socket, roomName, users);
	});
}

export default createRoom;
