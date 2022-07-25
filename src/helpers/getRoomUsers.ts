import { state } from '../state/state';
function getRoomUsers(roomName: string): Set<string> | undefined {
	return state.io.sockets.adapter.rooms.get(roomName);
}

export default getRoomUsers;
