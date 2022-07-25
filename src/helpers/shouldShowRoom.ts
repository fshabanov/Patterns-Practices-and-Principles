import * as config from '../socket/config';
import { state } from '../state/state';

function shouldShowRoom(roomName: string): boolean {
	const usersInRoom = state.io.sockets.adapter.rooms.get(
		roomName
	) as Set<string>;
	if (!usersInRoom || usersInRoom?.size >= config.MAXIMUM_USERS_FOR_ONE_ROOM)
		return false;
	return Array.from(usersInRoom).some(
		(user) => !state.users.get(user)?.isReady
	);
}

export default shouldShowRoom;
