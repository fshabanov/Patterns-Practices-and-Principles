import { User } from '../@types';
import getRoomUsers from '../helpers/getRoomUsers';
import { Commentator } from './commentator';
import { TextGenerator } from './textGenerator';

// Facade pattern

class CommentSender {
	_roomName: string;
	_commentator: Commentator;
	_textGenerator: TextGenerator;
	constructor(roomName: string) {
		this._roomName = roomName;
		[this._commentator, this._textGenerator] = this.createInstance();
	}

	createInstance() {
		// Singleton pattern
		if (!this._commentator) {
			this._commentator = new Commentator(this._roomName);
		}
		if (!this._textGenerator) {
			this._textGenerator = new TextGenerator(this._roomName);
		}
		return [this._commentator, this._textGenerator] as [
			Commentator,
			TextGenerator
		];
	}

	startGame() {
		const text = this._textGenerator.startGame();
		this._commentator.sendComment(text);
	}

	endGame(users: User[]) {
		const text = this._textGenerator.endGame(users);
		this._commentator.sendComment(text);
	}

	newUser(user: User) {
		const text = this._textGenerator.newUser(user);
		this._commentator.sendComment(text);
	}

	leaveRoom(user: User) {
		const text = this._textGenerator.leaveRoom(user);
		this._commentator.sendComment(text);
	}

	userReady(user: User) {
		const text = this._textGenerator.userReady(user);
		this._commentator.sendComment(text);
	}

	userNotReady(user: User) {
		const text = this._textGenerator.userNotReady(user);
		this._commentator.sendComment(text);
	}

	reportStatus() {
		const roomUsers = getRoomUsers(this._roomName);
		const text = this._textGenerator.reportStatus(roomUsers as Set<string>);
		this._commentator.sendComment(text);
	}

	userNear(user: User) {
		const text = this._textGenerator.userNear(user);
		this._commentator.sendComment(text);
	}

	userFinished(user: User) {
		const text = this._textGenerator.userFinished(user);
		this._commentator.sendComment(text);
	}

	randomText() {
		const text = this._textGenerator.randomText();
		this._commentator.sendComment(text);
	}
}

export { CommentSender };
