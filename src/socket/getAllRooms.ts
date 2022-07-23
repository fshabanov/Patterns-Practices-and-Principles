import { Socket } from 'socket.io';
import { Server } from 'socket.io';
import { Events } from '../@types';
import shouldShowRoom from '../helpers/shouldShowRoom';
import { rooms } from '../state';

function getAllRooms(io: Server, socket: Socket): void {
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
