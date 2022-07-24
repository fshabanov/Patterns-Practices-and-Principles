import { Socket } from 'socket.io';
import { Server } from 'socket.io';
import { Events, User } from '../@types';
import getRoomUsers from '../helpers/getRoomUsers';
import { Commentator } from '../services/commentator';
import { TextGenerator } from '../services/textGenerator';
import { rooms, textGenerators, users } from '../state';
import { roomCommentators } from '../state/commentator';
import joinRoom from './joinRoom';

function createRoom(io: Server, socket: Socket): void {
	socket.on(Events.CREATE_ROOM, (roomName: string) => {
		if (io.sockets.adapter.rooms.has(roomName)) {
			socket.emit(Events.ERROR, {
				message: 'Room with this name already exists',
			});
			return;
		}
		rooms.push(roomName);
		socket.join(roomName);
		textGenerators[roomName] = new TextGenerator(roomName);
		roomCommentators[roomName] = new Commentator(io, roomName);

		io.emit(Events.CREATE_ROOM, {
			name: roomName,
			numberOfUsers: getRoomUsers(io, roomName)?.size || 0,
		});
		joinRoom(io, socket, roomName);
	});
}

export default createRoom;
