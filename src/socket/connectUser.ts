import { Socket } from 'socket.io';
import { Events } from '../@types';
import { state } from '../state/state';
function connectUser(socket: Socket, username: string, device: string) {
	if (state.io.sockets.sockets.has(username)) {
		socket.emit(Events.USER_EXISTS, { message: 'Username already exists' });
		socket.disconnect();
		return;
	}
	state.io.sockets.sockets.set(username, socket);
	state.users.set(socket.id, {
		username,
		device,
		isReady: false,
		progress: 0,
		accuracy: 0,
		wpm: 0,
		socketId: socket.id,
	});

	console.log(`${username} connected`);
}

export default connectUser;
