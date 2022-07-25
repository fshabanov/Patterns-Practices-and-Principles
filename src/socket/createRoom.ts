import { Socket } from 'socket.io';
import { Events } from '../@types';
import getRoomUsers from '../helpers/getRoomUsers';
import { CommentSender } from '../services/commentSender';
import { state } from '../state/state';
import joinRoom from './joinRoom';

function createRoom(socket: Socket): void {
	socket.on(Events.CREATE_ROOM, (roomName: string) => {
		if (state.io.sockets.adapter.rooms.has(roomName)) {
			socket.emit(Events.ERROR, {
				message: 'Room with this name already exists',
			});
			return;
		}
		state.rooms.push(roomName);
		socket.join(roomName);
		if (!state.getRoomCommentator(roomName)) {
			state.setRoomCommentators(roomName, new CommentSender(roomName));
		}

		state.io.emit(Events.CREATE_ROOM, {
			name: roomName,
			numberOfUsers: getRoomUsers(roomName)?.size || 0,
		});
		joinRoom(socket, roomName);
	});
}

export default createRoom;
