"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _types_1 = require("../@types");
const state_1 = require("../state");
function joinRoom(io, socket, roomName) {
    io.to(roomName).emit(_types_1.Events.JOIN_ROOM, {
        name: roomName,
        users: Array.from(io.sockets.adapter.rooms.get(roomName)).map((user) => (Object.assign(Object.assign({}, state_1.users.get(user)), { isCurrentUser: user === socket.id }))),
        newUser: Object.assign(Object.assign({}, state_1.users.get(socket.id)), { socketId: socket.id }),
    });
}
exports.default = joinRoom;
