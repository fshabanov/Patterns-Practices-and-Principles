import { appendUserElement } from "./views/user.mjs";

const readyButton = document.getElementById("ready-btn");
let isReady = false;

function showRoom(socket, roomName, users, newUser) {
	const rooms = document.getElementById("rooms-page");
	rooms.classList.add("display-none");
	const room = document.getElementById("game-page");
	room.classList.remove("display-none");
	const button = document.getElementById("quit-room-btn");
	button.onclick = () => leaveRoom(socket, roomName);

	readyButton.onclick = () => {
		socket.emit("USER_READY", { isReady: !isReady, roomName });
		readyButton.innerText = isReady ? "READY" : "NOT READY";
		isReady = !isReady;
	};

	const header = document.getElementById("room-name");
	header.innerText = roomName;
	if (newUser.socketId === socket.id) {
		users.forEach((user) => {
			appendUserElement({ ...user, ready: user.isReady });
		});
	} else {
		appendUserElement({
			username: newUser?.username,
			isCurrentUser: newUser?.socketId === socket.id,
			ready: false,
		});
	}
}

function leaveRoom(socket, roomName) {
	const room = document.getElementById("game-page");
	room.classList.add("display-none");
	const rooms = document.getElementById("rooms-page");
	rooms.classList.remove("display-none");
	const users = document.getElementById("users-wrapper");
	users.innerHTML = "";
	isReady = false;
	readyButton.innerText = "READY";
	socket.emit("USER_READY", { isReady: false, roomName });

	socket.emit("LEAVE_ROOM", roomName);
}

function setIsReady(newValue) {
	isReady = newValue;
}

export default showRoom;
export { setIsReady };
