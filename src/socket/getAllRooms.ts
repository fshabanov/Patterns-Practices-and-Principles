import { Server, Socket } from "socket.io";
import { Events, User } from "../@types";
import shouldShowRoom from "../helpers/shouldShowRoom";

function getAllRooms(
	io: Server,
	socket: Socket,
	rooms: string[],
	users: Map<string, User>
): void {
	socket.emit(Events.GET_ALL_ROOMS, {
		rooms: rooms.map((room) => {
			if (shouldShowRoom(io, room, users))
				return {
					name: room,
					numberOfUsers: io.sockets.adapter.rooms.get(room)?.size || 0,
				};
		}),
	});
}

export default getAllRooms;
