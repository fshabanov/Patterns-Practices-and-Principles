import { Socket } from 'socket.io';
import { Events, User } from '../@types';
import { state } from '../state/state';
import startTimer from './startTimer';
function userReady(socket: Socket, isReady: boolean, roomName: string): void {
	const user = state.users.get(socket.id) as User;
	state.users.set(socket.id, {
		...user,
		isReady: isReady,
	});
	const commentSender = state.getRoomCommentator(roomName);
	if (isReady) {
		commentSender.userReady(user);
	} else {
		commentSender.userNotReady(user);
	}
	state.io.to(roomName).emit(Events.USER_READY, {
		...state.users.get(socket.id),
	});
	startTimer(roomName);
}

export default userReady;
