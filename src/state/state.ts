import { Server } from 'socket.io';
import { IRoomProgress, User } from '../@types';
import { CommentSender } from '../services/commentSender';

// Singleton pattern

class State {
	private _instance: State | undefined;
	private _roomProgress: IRoomProgress;
	private _startedGameRooms: Set<string>;
	private _users: Map<string, User>;
	private _rooms: string[];
	private _wasEndGameInfoSent: { [roomName: string]: boolean };
	private _roomCommentators: { [roomName: string]: CommentSender };
	private _io: Server | undefined;
	constructor() {
		this._instance;
		this._roomProgress = {};
		this._startedGameRooms = new Set<string>();
		this._users = new Map<string, User>();
		this._rooms = [];
		this._wasEndGameInfoSent = {};
		this._roomCommentators = {};
		this._io;
	}

	private createInstance() {
		if (!this._instance) {
			this._instance = this;
		}
	}

	get instance() {
		if (!this._instance) {
			this.createInstance();
		}
		return this._instance as State;
	}

	get roomProgress() {
		return this._roomProgress;
	}

	setRoomProgress(roomName: string, progress: Map<string, number>) {
		this._roomProgress[roomName] = progress;
	}

	get startedGameRooms() {
		return this._startedGameRooms;
	}

	get users() {
		return this._users;
	}

	get rooms() {
		return this._rooms;
	}

	set rooms(roomsArr: string[]) {
		this._rooms = roomsArr;
	}

	get wasEndGameInfoSent() {
		return this._wasEndGameInfoSent;
	}

	setWasEndGameInfoSent(roomName: string, wasSent: boolean) {
		this._wasEndGameInfoSent[roomName] = wasSent;
	}

	getRoomCommentator(roomName: string) {
		if (!this._roomCommentators[roomName]) {
			this.setRoomCommentators(roomName, new CommentSender(roomName));
		}
		return this._roomCommentators[roomName];
	}

	setRoomCommentators(roomName: string, commentator: CommentSender) {
		this._roomCommentators[roomName] = commentator;
	}

	get io() {
		return this._io as Server;
	}

	set io(ioInstance: Server) {
		this._io = ioInstance;
	}
}

const state = new State().instance;

export { state };
