import { Socket } from 'socket.io';
import { Events, User } from '../@types';
import getRoomUsers from '../helpers/getRoomUsers';
import shouldEndGameWhenLeave from '../helpers/shouldEndGameWhenLeave';
import shouldShowRoom from '../helpers/shouldShowRoom';
import endGame from './endGame';
import * as config from './config';
import { state } from '../state/state';

function leaveRoom(socket: Socket, room: string): string[] {
	socket.leave(room);
	state.roomProgress[room]?.delete(socket.id);
	const commentSender = state.getRoomCommentator(room);
	commentSender.leaveRoom(state.users.get(socket.id) as User);
	if (shouldShowRoom(room)) {
		const numOfUsers = getRoomUsers(room)?.size || 0;
		// there were max num of people, one left
		if (numOfUsers === config.MAXIMUM_USERS_FOR_ONE_ROOM - 1) {
			state.io.emit(Events.CREATE_ROOM, {
				name: room,
				numberOfUsers: numOfUsers,
			});
		} else {
			state.io.emit(Events.UPDATE_ROOMS, {
				name: room,
				numberOfUsers: getRoomUsers(room)?.size || 0,
			});
		}
	}

	state.users.set(socket.id, {
		...state.users.get(socket.id),
		isReady: false,
	} as User);
	if (!getRoomUsers(room)?.size) {
		state.io.sockets.adapter.rooms.delete(room);
		state.io.emit(Events.REMOVE_ROOM, {
			name: room,
		});
		state.startedGameRooms.delete(room);
		return state.rooms.filter((r) => r !== room);
	}
	state.io.to(room).emit(Events.LEAVE_ROOM, {
		...state.users.get(socket.id),
	});
	if (shouldEndGameWhenLeave(room)) {
		endGame(socket, true, room);
	}
	return state.rooms;
}

export default leaveRoom;
