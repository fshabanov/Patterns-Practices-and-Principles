import { Socket } from 'socket.io';
function getRoomName(socket: Socket): string {
	return Array.from(socket.rooms).filter((room) => room !== socket.id)[0];
}

export default getRoomName;
