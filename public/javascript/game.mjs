import { showMessageModal } from "./views/modal.mjs";
import listenCreateButton from "./createRoom.mjs";
import {
	appendRoomElement,
	removeRoomElement,
	updateNumberOfUsersInRoom,
} from "./views/room.mjs";
import showRoom from "./changeRoom.mjs";
import {
	changeReadyStatus,
	removeUserElement,
	setProgress,
} from "./views/user.mjs";
import startGameTimer from "./game/startTimer.mjs";
import endGame from "./game/endGame.mjs";

const username = sessionStorage.getItem("username");

if (!username) {
	window.location.replace("/login");
}

const socket = io("", { query: { username } });
listenCreateButton(socket);

socket.on("USER_EXISTS", ({ message }) => {
	showMessageModal({
		message,
		onClose: () => {
			sessionStorage.removeItem("username");
			window.location.replace("/login");
		},
	});
});

socket.on("ERROR", ({ message }) => {
	showMessageModal({
		message,
	});
});

socket.on("UPDATE_ROOMS", (data) => {
	if (!data) return;
	const { name, numberOfUsers } = data;
	updateNumberOfUsersInRoom({ name, numberOfUsers });
});

socket.on("GET_ALL_ROOMS", ({ rooms }) => {
	for (let room of rooms) {
		if (!room) continue;
		const { name, numberOfUsers } = room;
		appendRoomElement({
			name,
			numberOfUsers,
			onJoin: () => socket.emit("JOIN_ROOM", name),
		});
	}
});

socket.on("REMOVE_ROOM", ({ name }) => {
	removeRoomElement(name);
});

socket.on("JOIN_ROOM", ({ name, users, newUser }) => {
	showRoom(socket, name, users, newUser);
});

socket.on("LEAVE_ROOM", ({ username }) => {
	removeUserElement(username);
});

socket.on("USER_READY", ({ username, isReady }) => {
	changeReadyStatus({ username, ready: isReady });
});

socket.on("START_GAME", ({ timer, duration, textIdx }) => {
	startGameTimer(timer, duration, textIdx);
});

socket.on("CHANGE_PROGRESS", ({ username, progress }) => {
	setProgress({ username, progress });
});

socket.on("END_GAME", ({ userOrder }) => {
	endGame(userOrder);
});

export default socket;
