import { Server, Socket } from "socket.io";
import { Events, User } from "../@types";

function joinRoom(
	io: Server,
	socket: Socket,
	roomName: string,
	users: Map<string, User>
) {
	io.to(roomName).emit(Events.JOIN_ROOM, {
		name: roomName,
		users: Array.from(
			io.sockets.adapter.rooms.get(roomName) as Set<string>
		).map((user) => ({
			...users.get(user),
			isCurrentUser: user === socket.id,
		})),
		newUser: {
			...users.get(socket.id),
			socketId: socket.id,
		},
	});
}

export default joinRoom;
