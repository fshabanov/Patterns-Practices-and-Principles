import { Server, Socket } from "socket.io";
import { Events, User } from "../@types";
import { roomProgress, rooms, startedGameRooms, users } from "../state";
import getRoomUsers from "../helpers/getRoomUsers";
import shouldEndGameWhenLeave from "../helpers/shouldEndGameWhenLeave";
import shouldShowRoom from "../helpers/shouldShowRoom";
import endGame from "./endGame";
import * as config from "./config";

function leaveRoom(io: Server, socket: Socket, room: string): string[] {
	socket.leave(room);
	roomProgress[room]?.delete(socket.id);
	if (shouldShowRoom(io, room)) {
		const numOfUsers = getRoomUsers(io, room)?.size || 0;
		// there were max num of people, one left
		if (numOfUsers === config.MAXIMUM_USERS_FOR_ONE_ROOM - 1) {
			io.emit(Events.CREATE_ROOM, {
				name: room,
				numberOfUsers: numOfUsers,
			});
		} else {
			io.emit(Events.UPDATE_ROOMS, {
				name: room,
				numberOfUsers: getRoomUsers(io, room)?.size || 0,
			});
		}
	}

	users.set(socket.id, { ...users.get(socket.id), isReady: false } as User);
	if (!getRoomUsers(io, room)?.size) {
		io.sockets.adapter.rooms.delete(room);
		io.emit(Events.REMOVE_ROOM, {
			name: room,
		});
		startedGameRooms.delete(room);
		return rooms.filter((r) => r !== room);
	}
	io.to(room).emit(Events.LEAVE_ROOM, {
		...users.get(socket.id),
	});
	if (shouldEndGameWhenLeave(io, room)) {
		endGame(io, socket, true, room);
	}
	return rooms;
}

export default leaveRoom;
