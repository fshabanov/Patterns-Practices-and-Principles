import { Server } from 'socket.io';
import { Events } from '../@types';

// Singleton principle

class Commentator {
	_io: Server;
	_roomName: string;
	constructor(io: Server, roomName: string) {
		this._io = io;
		this._roomName = roomName;
	}
	sendComment(comment: string) {
		this._io.to(this._roomName).emit(Events.SEND_COMMENT, comment);
	}
}

export { Commentator };
