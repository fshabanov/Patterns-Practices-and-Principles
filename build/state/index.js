"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setRooms = exports.rooms = exports.users = exports.startedGameRooms = exports.roomProgress = void 0;
const roomProgress = {};
exports.roomProgress = roomProgress;
const startedGameRooms = new Set();
exports.startedGameRooms = startedGameRooms;
const users = new Map();
exports.users = users;
let rooms = [];
exports.rooms = rooms;
function setRooms(newRooms) {
    exports.rooms = rooms = newRooms;
}
exports.setRooms = setRooms;
