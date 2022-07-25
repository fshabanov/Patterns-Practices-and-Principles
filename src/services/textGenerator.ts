import { randomTextData } from '../randomTextData';
import { User } from '../@types';
import { roomProgress, users } from '../state';
import * as config from '../socket/config';

class TextGenerator {
	_userList: Set<User>;
	_roomName: string;
	constructor(roomName: string) {
		this._userList = new Set<User>();
		this._roomName = roomName;
	}

	startGame() {
		return `Welcome to the game!
            Here is the list of all players:
            ${this._listUsers()}
            Good luck to everybody!
        `;
	}

	endGame(userList: User[]) {
		return `The game has ended! Here is the list of the winners:
			${this._listUsers(userList.slice(0, 3), true)}
			Thanks for playing!`;
	}

	newUser(user: User) {
		this._userList.add(user);
		return `${user.username} has joined the game using their ${user.device} device!\n
        Welcome to the game!\n\n
        My name is botComment and I will be your commentator for this game!`;
	}

	leaveRoom(user: User) {
		this._userList.delete(user);
		return `${user.username} has left the game!`;
	}

	reportStatus(roomUsers: Set<string>) {
		const finishedUsers = roomProgress[this._roomName];
		const roomUserData = [...roomUsers].map((user) => users.get(user) as User);
		roomUserData.sort((a, b) => b.progress - a.progress);
		const userOrderText = `The order of the players is:
				${this._listUsers(roomUserData.filter((user) => user.progress !== 100))}`;
		if (finishedUsers.size === 0) {
			return `No one has finished the game yet! ${userOrderText}`;
		} else {
			return `The following users have finished the game: ${Array.from(
				finishedUsers.keys()
			)
				.map((socketId) => users.get(socketId)?.username)
				.join(', ')}! Remaining - keep it up!
				${userOrderText}`;
		}
	}

	userReady(user: User) {
		return `${user.username} is ready to start the game with their ${user.device} device! We are waiting for all players to be ready to start this race!`;
	}

	userNotReady(user: User) {
		return `${user.username} has changed their mind and is not ready to start the game anymore :(`;
	}

	userNear(user: User) {
		return `${user.username} is near the end of the game with their ${user.device} device! They have only 30 characters left!`;
	}

	userFinished(user: User) {
		return `${user.username} has finished the game with their ${user.device} device! Our congratulations!`;
	}

	randomText() {
		return randomTextData[Math.floor(Math.random() * randomTextData.length)];
	}

	private _listUsers(users?: User[], showTime?: boolean) {
		const toList = users && users.length ? users : [...this._userList];
		return `${toList
			.map(
				(user, idx) =>
					`${idx + 1}) ${user.username} - using their ${user.device} device ${
						showTime &&
						'spending ' +
							(user.timeUsed || config.SECONDS_FOR_GAME) +
							' seconds'
					}`
			)
			.join('\n')}`;
	}
}

export { TextGenerator };
