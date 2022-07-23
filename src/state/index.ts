import { IRoomProgress, User } from '../@types';
import { textGenerators } from './textGenerators';

const roomProgress: IRoomProgress = {};

const startedGameRooms = new Set<string>();

const users = new Map<string, User>();

let rooms: string[] = [];

function setRooms(newRooms: string[]): void {
	rooms = newRooms;
}

const wasEndGameInfoSent: {
	[roomName: string]: boolean;
} = {};

export {
	roomProgress,
	startedGameRooms,
	users,
	rooms,
	setRooms,
	wasEndGameInfoSent,
	textGenerators,
};
