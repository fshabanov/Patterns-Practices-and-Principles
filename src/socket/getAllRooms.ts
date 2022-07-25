import { Socket } from 'socket.io';
import { Events } from '../@types';
import shouldShowRoom from '../helpers/shouldShowRoom';
import { state } from '../state/state';

function getAllRooms(socket: Socket): void {
	socket.emit(Events.GET_ALL_ROOMS, {
		rooms: state.rooms.map((room) => {
			if (shouldShowRoom(room))
				return {
					name: room,
					numberOfUsers: state.io.sockets.adapter.rooms.get(room)?.size || 0,
				};
		}),
	});
}

export default getAllRooms;
