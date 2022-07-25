import { Server } from 'socket.io';
import { Events } from '../@types';
import { state } from '../state/state';

class Commentator {
	_io: Server;
	_roomName: string;
	constructor(roomName: string) {
		this._io = state.io;
		this._roomName = roomName;
	}

	sendComment(comment: string) {
		this._io.to(this._roomName).emit(Events.SEND_COMMENT, comment);
	}
}

export { Commentator };
