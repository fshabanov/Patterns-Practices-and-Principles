import { showInputModal } from "./views/modal.mjs";
import { appendRoomElement } from "./views/room.mjs";

function listenCreateButton(socket) {
	const button = document.getElementById("add-room-btn");

	button.onclick = () => {
		let roomTitle = "";
		showInputModal({
			title: "Create Room",
			onChange: (value) => {
				roomTitle = value;
			},
			onSubmit: () => {
				socket.emit("CREATE_ROOM", roomTitle);
			},
		});
	};

	socket.on("CREATE_ROOM", ({ name, numberOfUsers }) => {
		appendRoomElement({
			name,
			numberOfUsers,
			onJoin: () => {
				socket.emit("JOIN_ROOM", name);
			},
		});
	});
}

export default listenCreateButton;
