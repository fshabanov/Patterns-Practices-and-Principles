import { Server } from "socket.io";
import { users } from "../state";

function shouldShowRoom(io: Server, roomName: string): boolean {
	const usersInRoom = io.sockets.adapter.rooms.get(roomName) as Set<string>;
	if (!usersInRoom) return false;
	if (usersInRoom?.size >= 5) return false;
	return Array.from(usersInRoom).some((user) => !users.get(user)?.isReady);
}

export default shouldShowRoom;
