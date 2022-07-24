import { Socket, Server } from 'socket.io';
import { Events, User } from '../@types';
import getRoomName from '../helpers/getRoomName';
import getRoomUsers from '../helpers/getRoomUsers';
import shouldShowRoom from '../helpers/shouldShowRoom';
import {
	roomProgress,
	startedGameRooms,
	users,
	wasEndGameInfoSent,
} from '../state';
import { endGameComment } from '../helpers/comments/comments';

function endGame(
	io: Server,
	socket: Socket,
	sendAll = false,
	customRoomName?: string
): void {
	const roomName = customRoomName ? customRoomName : getRoomName(socket);
	const roomUsers = getRoomUsers(io, roomName);
	if (roomUsers) {
		const toAdd: User[] = [];
		roomUsers.forEach((user) => {
			const userInfo = users.get(user);
			if (!roomProgress[roomName]?.has(user)) {
				toAdd.push(userInfo as User);
			}
		});
		toAdd.sort((a, b) => {
			return b.progress - a.progress === 0
				? b.accuracy - a.accuracy
				: b.progress - a.progress;
		});
		let userOrder = Array.from(roomProgress[roomName])
			.map((socketId) => users.get(socketId[0]) as User)
			.concat(toAdd);

		endGameComment(roomName, userOrder);

		if (sendAll) {
			io.to(roomName).emit(Events.END_GAME, {
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

	startedGameRooms.delete(roomName);

	roomUsers?.forEach((user) => {
		users.set(user, {
			...users.get(user),
			isReady: false,
			progress: 0,
		} as User);

		io.to(roomName).emit(Events.USER_READY, {
			...users.get(user),
			isReady: false,
		});
	});

	if (shouldShowRoom(io, roomName) && !wasEndGameInfoSent[roomName]) {
		io.emit(Events.CREATE_ROOM, {
			name: roomName,
			numberOfUsers: getRoomUsers(io, roomName)?.size || 0,
		});
		wasEndGameInfoSent[roomName] = true;
	}
}

export default endGame;
