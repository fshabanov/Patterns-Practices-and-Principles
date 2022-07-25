import { Events, User } from '../@types';
import * as config from './config';
import data from '../data';
import getRoomUsers from '../helpers/getRoomUsers';
import { state } from '../state/state';

function startTimer(roomName: string): void {
	const usersInRoom = getRoomUsers(roomName) as Set<string>;
	if (!usersInRoom) return;
	if (
		Array.from(usersInRoom).every((user) => state.users.get(user)?.isReady) &&
		!state.startedGameRooms.has(roomName)
	) {
		state.setWasEndGameInfoSent(roomName, false);
		state.setRoomProgress(roomName, new Map<string, number>());
		state.startedGameRooms.add(roomName);
		const roomUsers = getRoomUsers(roomName);
		roomUsers?.forEach((user) => {
			state.users.set(user, {
				...state.users.get(user),
				progress: 0,
			} as User);

			state.io.to(roomName).emit(Events.CHANGE_PROGRESS, {
				...state.users.get(user),
				progress: 0,
			});
		});
		const commentSender = state.getRoomCommentator(roomName);
		commentSender.startGame();
		// if all users are ready, start the game
		state.io.to(roomName).emit(Events.START_GAME, {
			timer: config.SECONDS_TIMER_BEFORE_START_GAME,
			duration: config.SECONDS_FOR_GAME,
			textIdx: Math.floor(Math.random() * (data.texts.length - 1)),
		});
		state.io.emit(Events.REMOVE_ROOM, {
			name: roomName,
		});
	}
}

export default startTimer;
