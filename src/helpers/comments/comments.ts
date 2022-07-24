import { CommentType, User } from '../../@types';
import { sendComment } from './sendComment';

function startGameComment(roomName: string) {
	sendComment(roomName, CommentType.START_GAME);
}

function endGameComment(roomName: string, users: User[]) {
	sendComment(roomName, CommentType.END_GAME, users);
}

function joinRoomComment(roomName: string, user: User) {
	sendComment(roomName, CommentType.JOIN_ROOM, user);
}

function leaveRoomComment(roomName: string, user: User) {
	sendComment(roomName, CommentType.LEAVE_ROOM, user);
}

function userReadyComment(roomName: string, user: User) {
	sendComment(roomName, CommentType.USER_READY, user);
}

function userNotReadyComment(roomName: string, user: User) {
	sendComment(roomName, CommentType.USER_NOT_READY, user);
}

function reportStatusComment(roomName: string) {
	sendComment(roomName, CommentType.REPORT_STATUS);
}

function userNearComment(roomName: string, user: User) {
	sendComment(roomName, CommentType.USER_NEAR, user);
}

function userFinishedComment(roomName: string, user: User) {
	sendComment(roomName, CommentType.USER_FINISHED, user);
}

function randomDataComment(roomName: string) {
	sendComment(roomName, CommentType.RANDOM_DATA);
}

export {
	startGameComment,
	endGameComment,
	joinRoomComment,
	leaveRoomComment,
	userReadyComment,
	userNotReadyComment,
	reportStatusComment,
	userNearComment,
	userFinishedComment,
	randomDataComment,
};
