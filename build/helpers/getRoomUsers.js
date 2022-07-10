"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function getRoomUsers(io, roomName) {
    return io.sockets.adapter.rooms.get(roomName);
}
exports.default = getRoomUsers;
