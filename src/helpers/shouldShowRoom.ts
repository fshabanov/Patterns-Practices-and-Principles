import { Server } from "socket.io";
import { User } from "../@types";

function shouldShowRoom(
	io: Server,
	roomName: string,
	users: Map<string, User>
): boolean {
	const usersInRoom = io.sockets.adapter.rooms.get(roomName) as Set<string>;
	if (!usersInRoom) return false;
	return Array.from(usersInRoom).some((user) => !users.get(user)?.isReady);
}

export default shouldShowRoom;
