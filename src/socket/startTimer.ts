import { Server } from 'socket.io';
import { Events, User } from '../@types';
import * as config from './config';
import data from '../data';
import getRoomUsers from '../helpers/getRoomUsers';
import {
	roomProgress,
	startedGameRooms,
	users,
	wasEndGameInfoSent,
} from '../state';
import { roomCommentators } from '../state/commentator';

function startTimer(io: Server, roomName: string): void {
	const usersInRoom = getRoomUsers(io, roomName) as Set<string>;
	if (!usersInRoom) return;
	if (
		Array.from(usersInRoom).every((user) => users.get(user)?.isReady) &&
		!startedGameRooms.has(roomName)
	) {
		wasEndGameInfoSent[roomName] = false;
		roomProgress[roomName] = new Map<string, number>();
		startedGameRooms.add(roomName);
		const roomUsers = getRoomUsers(io, roomName);
		roomUsers?.forEach((user) => {
			users.set(user, {
				...users.get(user),
				progress: 0,
			} as User);

			io.to(roomName).emit(Events.CHANGE_PROGRESS, {
				...users.get(user),
				progress: 0,
			});
		});
		const commentSender = roomCommentators[roomName];
		commentSender.startGame();
		// if all users are ready, start the game
		io.to(roomName).emit(Events.START_GAME, {
			timer: config.SECONDS_TIMER_BEFORE_START_GAME,
			duration: config.SECONDS_FOR_GAME,
			textIdx: Math.floor(Math.random() * (data.texts.length - 1)),
		});
		io.emit(Events.REMOVE_ROOM, {
			name: roomName,
		});
	}
}

export default startTimer;
