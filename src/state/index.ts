import { IRoomProgress, User } from "../@types";

const roomProgress: IRoomProgress = {};

const startedGameRooms = new Set<string>();

const users = new Map<string, User>();

export { roomProgress, startedGameRooms, users };
