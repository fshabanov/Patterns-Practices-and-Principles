import { Server } from "socket.io";
function getRoomUsers(io: Server, roomName: string): Set<string> | undefined {
	return io.sockets.adapter.rooms.get(roomName);
}

export default getRoomUsers;
