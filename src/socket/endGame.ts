import { Server } from "socket.io";
import { Socket } from "socket.io";
import { Events, User } from "../@types";
import getRoomName from "../helpers/getRoomName";
import getRoomUsers from "../helpers/getRoomUsers";
import shouldShowRoom from "../helpers/shouldShowRoom";
import { roomProgress, startedGameRooms, users } from "../state";

function endGame(
	io: Server,
	socket: Socket,
	sendAll = false,
	customRoomName?: string,
	customRoomUsers?: Set<string>
): void {
	const roomName = customRoomName ? customRoomName : getRoomName(socket);
	const roomUsers = customRoomUsers
		? customRoomUsers
		: getRoomUsers(io, roomName);
	if (roomUsers) {
		const toAdd: User[] = [];
		roomUsers.forEach((user) => {
			const userInfo = users.get(user);
			if (!roomProgress[roomName]?.has(user)) {
				toAdd.push(userInfo as User);
			}
		});
		toAdd.sort((a, b) => b.progress - a.progress);
		let userOrder = Array.from(roomProgress[roomName])
			.map((socketId) => users.get(socketId))
			.concat(toAdd);

		if (sendAll) {
			io.to(roomName).emit(Events.END_GAME, {
				userOrder: userOrder.filter((usr) =>
					roomUsers.has(usr?.socketId as string)
				),
			});
		} else {
			socket.emit(Events.END_GAME, {
				userOrder: userOrder.filter((usr) =>
					roomUsers.has(usr?.socketId as string)
				),
			});
		}
	}

	startedGameRooms.delete(roomName);

	roomUsers?.forEach((user) => {
		users.set(user, {
			...users.get(user),
			isReady: false,
			progress: 0,
		} as User);

		io.to(roomName).emit(Events.USER_READY, {
			...users.get(user),
			isReady: false,
		});
	});

	if (roomUsers && roomUsers?.size < 5) {
		shouldShowRoom(io, roomName) &&
			io.emit(Events.CREATE_ROOM, {
				name: roomName,
				numberOfUsers: getRoomUsers(io, roomName)?.size || 0,
			});
	}
}

export default endGame;
