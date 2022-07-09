import { Server } from "socket.io";
import { Events, User } from "../@types";
import * as config from "./config";
import data from "../data";

function startTimer(
	io: Server,
	users: Map<string, User>,
	roomName: string
): void {
	const usersInRoom = io.sockets.adapter.rooms.get(roomName) as Set<string>;
	if (!usersInRoom) return;
	if (Array.from(usersInRoom).every((user) => users.get(user)?.isReady)) {
		// if all users are ready, start the game
		io.to(roomName).emit(Events.START_GAME, {
			timer: config.SECONDS_TIMER_BEFORE_START_GAME,
			duration: config.SECONDS_FOR_GAME,
			textIdx: Math.floor(Math.random() * (data.texts.length - 1)),
			roomName,
		});
		io.emit(Events.REMOVE_ROOM, {
			name: roomName,
		});
	}
}

export default startTimer;
