import { Server, Socket } from "socket.io";
import { Events } from "../@types";
import shouldShowRoom from "../helpers/shouldShowRoom";

function getAllRooms(io: Server, socket: Socket, rooms: string[]): void {
	socket.emit(Events.GET_ALL_ROOMS, {
		rooms: rooms.map((room) => {
			if (shouldShowRoom(io, room))
				return {
					name: room,
					numberOfUsers: io.sockets.adapter.rooms.get(room)?.size || 0,
				};
		}),
	});
}

export default getAllRooms;
