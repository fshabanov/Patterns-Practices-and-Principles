import { Socket } from 'socket.io';
import { Events, User } from '../@types';
import getRoomUsers from '../helpers/getRoomUsers';
import { state } from '../state/state';

function joinRoom(socket: Socket, roomName: string) {
	const joinedUser = state.users.get(socket.id) as User;
	state.io.to(roomName).emit(Events.JOIN_ROOM, {
		name: roomName,
		users: Array.from(getRoomUsers(roomName) as Set<string>).map((user) => ({
			...state.users.get(user),
			isCurrentUser: user === socket.id,
		})),
		newUser: {
			...joinedUser,
			socketId: socket.id,
		},
	});
	const commentSender = state.getRoomCommentator(roomName);
	commentSender.newUser(joinedUser);
}

export default joinRoom;
