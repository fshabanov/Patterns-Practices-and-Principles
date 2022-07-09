import { Server, Socket } from "socket.io";
import { users } from "../state";
import getRoomUsers from "./getRoomUsers";

function shouldEndGameWhenLeave(io: Server, roomName: string): boolean {
	const roomUsers = getRoomUsers(io, roomName);
	if (roomUsers) {
		for (let user of Array.from(roomUsers)) {
			let foundUser = users.get(user);
			if (foundUser && foundUser?.progress < 100) {
				return false;
			}
		}
	}
	return true;
}

export default shouldEndGameWhenLeave;
