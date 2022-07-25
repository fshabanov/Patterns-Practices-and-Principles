import { state } from '../state/state';
import getRoomUsers from './getRoomUsers';

function shouldEndGameWhenLeave(roomName: string): boolean {
	const roomUsers = getRoomUsers(roomName);
	if (roomUsers) {
		for (let user of Array.from(roomUsers)) {
			let foundUser = state.users.get(user);
			if (foundUser && foundUser?.progress < 100) {
				return false;
			}
		}
	}
	return true;
}

export default shouldEndGameWhenLeave;
