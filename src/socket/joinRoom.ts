import { Socket } from 'socket.io';
import { Server } from 'socket.io';
import { Events, User } from '../@types';
import getRoomUsers from '../helpers/getRoomUsers';
import { users } from '../state';
import { roomCommentators } from '../state/commentator';

function joinRoom(io: Server, socket: Socket, roomName: string) {
	const joinedUser = users.get(socket.id) as User;
	io.to(roomName).emit(Events.JOIN_ROOM, {
		name: roomName,
		users: Array.from(getRoomUsers(io, roomName) as Set<string>).map(
			(user) => ({
				...users.get(user),
				isCurrentUser: user === socket.id,
			})
		),
		newUser: {
			...joinedUser,
			socketId: socket.id,
		},
	});
	const commentSender = roomCommentators[roomName];
	commentSender.newUser(joinedUser);
}

export default joinRoom;
