enum Events {
	ERROR = 'ERROR',
	CREATE_ROOM = 'CREATE_ROOM',
	USER_EXISTS = 'USER_EXISTS',
	UPDATE_ROOMS = 'UPDATE_ROOMS',
	JOIN_ROOM = 'JOIN_ROOM',
	GET_ALL_ROOMS = 'GET_ALL_ROOMS',
	REMOVE_ROOM = 'REMOVE_ROOM',
	LEAVE_ROOM = 'LEAVE_ROOM',
	USER_READY = 'USER_READY',
	START_GAME = 'START_GAME',
	CHANGE_PROGRESS = 'CHANGE_PROGRESS',
	END_GAME = 'END_GAME',
	SEND_COMMENT = 'SEND_COMMENT',
}

interface User {
	username: string;
	device: string;
	isReady: boolean;
	progress: number;
	accuracy: number;
	wpm: number;
	socketId: string;
}

interface IRoomProgress {
	[key: string]: Set<string>;
}

export { Events, User, IRoomProgress };
