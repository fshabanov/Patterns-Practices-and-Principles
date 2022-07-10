import { Server } from "socket.io";
import { users } from "../state";
import * as config from "../socket/config";

function shouldShowRoom(io: Server, roomName: string): boolean {
	const usersInRoom = io.sockets.adapter.rooms.get(roomName) as Set<string>;
	if (!usersInRoom || usersInRoom?.size >= config.MAXIMUM_USERS_FOR_ONE_ROOM)
		return false;
	return Array.from(usersInRoom).some((user) => !users.get(user)?.isReady);
}

export default shouldShowRoom;
