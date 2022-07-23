import { Socket } from 'socket.io';
import { Server } from 'socket.io';
import { Events, User } from '../@types';
import { textGenerators, users } from '../state';
import { roomCommentators } from '../state/commentator';

function joinRoom(io: Server, socket: Socket, roomName: string) {
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
	roomCommentators[roomName].sendComment(
		textGenerators[roomName].newUser(users.get(socket.id) as User)
	);
}

export default joinRoom;
