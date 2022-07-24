import { Socket } from 'socket.io';
import { Server } from 'socket.io';
import { Events, User } from '../@types';
import {
	userNotReadyComment,
	userReadyComment,
} from '../helpers/comments/comments';
import { users } from '../state';
import startTimer from './startTimer';
function userReady(
	io: Server,
	socket: Socket,
	isReady: boolean,
	roomName: string
): void {
	const user = users.get(socket.id) as User;
	users.set(socket.id, {
		...user,
		isReady: isReady,
	});
	if (isReady) {
		userReadyComment(roomName, user);
	} else {
		userNotReadyComment(roomName, user);
	}
	io.to(roomName).emit(Events.USER_READY, {
		...users.get(socket.id),
	});
	startTimer(io, roomName);
}

export default userReady;
