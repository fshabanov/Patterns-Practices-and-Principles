import { Socket } from 'socket.io';
import { Server } from 'socket.io';
import { Events } from '../@types';
import { users } from '../state';
function connectUser(
	io: Server,
	socket: Socket,
	username: string,
	device: string
) {
	if (io.sockets.sockets.has(username)) {
		socket.emit(Events.USER_EXISTS, { message: 'Username already exists' });
		socket.disconnect();
		return;
	}
	io.sockets.sockets.set(username, socket);
	users.set(socket.id, {
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
