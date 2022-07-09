import { Socket } from "socket.io";
import { Server } from "socket.io";
import { Events, User } from "../@types";
import { users } from "../state";
import startTimer from "./startTimer";
function userReady(
	io: Server,
	socket: Socket,
	isReady: boolean,
	roomName: string
): void {
	users.set(socket.id, {
		...users.get(socket.id),
		isReady: isReady,
	} as User);
	io.to(roomName).emit(Events.USER_READY, {
		...users.get(socket.id),
	});
	startTimer(io, roomName);
}

export default userReady;
