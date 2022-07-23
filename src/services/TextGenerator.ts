import { User } from '../@types';

class TextGenerator {
	_userList: User[];
	constructor(userList: User[]) {
		this._userList = userList;
	}

	startGame() {
		return `Welcome to the game!
            Here is the list of all players:
            ${this._listUsers()}
            Good luck to everybody!
        `;
	}

	newUser(user: User) {
		this._userList.push(user);
		return `${user.username} has joined the game using their ${user.device} device!`;
	}

	_listUsers() {
		return `${this._userList
			.map((user) => `${user.username} - using their ${user.device} device`)
			.join('\n')}`;
	}
}

export { TextGenerator };
