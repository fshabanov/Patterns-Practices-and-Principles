import { Socket } from 'socket.io';
import { Events, User } from '../@types';
import getRoomName from '../helpers/getRoomName';
import getRoomUsers from '../helpers/getRoomUsers';
import shouldShowRoom from '../helpers/shouldShowRoom';
import { state } from '../state/state';

function endGame(
	socket: Socket,
	sendAll = false,
	customRoomName?: string
): void {
	const roomName = customRoomName ? customRoomName : getRoomName(socket);
	const roomUsers = getRoomUsers(roomName);
	if (roomUsers) {
		const toAdd: User[] = [];
		roomUsers.forEach((user) => {
			const userInfo = state.users.get(user);
			if (!state.roomProgress[roomName]?.has(user)) {
				toAdd.push(userInfo as User);
			}
		});
		toAdd.sort((a, b) => {
			return b.progress - a.progress === 0
				? b.accuracy - a.accuracy
				: b.progress - a.progress;
		});
		let userOrder = Array.from(state.roomProgress[roomName])
			.map((socketId) => state.users.get(socketId[0]) as User)
			.concat(toAdd);

		const commentSender = state.getRoomCommentator(roomName);
		commentSender.endGame(userOrder);

		if (sendAll) {
			state.io.to(roomName).emit(Events.END_GAME, {
				userOrder: userOrder.filter((usr) =>
					roomUsers.has(usr?.socketId as string)
				),
			});
		} else {
			socket.emit(Events.END_GAME, {
				userOrder: userOrder.filter((usr) =>
					roomUsers.has(usr?.socketId as string)
				),
			});
		}
	}

	state.startedGameRooms.delete(roomName);

	roomUsers?.forEach((user) => {
		state.users.set(user, {
			...state.users.get(user),
			isReady: false,
			progress: 0,
		} as User);

		state.io.to(roomName).emit(Events.USER_READY, {
			...state.users.get(user),
			isReady: false,
		});
	});

	if (shouldShowRoom(roomName) && !state.wasEndGameInfoSent[roomName]) {
		state.io.emit(Events.CREATE_ROOM, {
			name: roomName,
			numberOfUsers: getRoomUsers(roomName)?.size || 0,
		});
		state.setWasEndGameInfoSent(roomName, true);
	}
}

export default endGame;
