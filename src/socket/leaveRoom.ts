import { Server, Socket } from "socket.io";
import { Events, User } from "../@types";
import shouldShowRoom from "../helpers/shouldShowRoom";

function leaveRoom(
	io: Server,
	socket: Socket,
	room: string,
	rooms: string[],
	users: Map<string, User>
): string[] {
	socket.leave(room);
	shouldShowRoom(io, room, users) &&
		io.emit(Events.UPDATE_ROOMS, {
			name: room,
			numberOfUsers: io.sockets.adapter.rooms.get(room)?.size || 0,
		});
	users.set(socket.id, { ...users.get(socket.id), isReady: false } as User);
	if (!io.sockets.adapter.rooms.get(room)?.size) {
		io.sockets.adapter.rooms.delete(room);
		io.emit(Events.REMOVE_ROOM, {
			name: room,
		});
		return rooms.filter((r) => r !== room);
	}
	io.to(room).emit(Events.LEAVE_ROOM, {
		...users.get(socket.id),
	});
	return rooms;
}

export default leaveRoom;
