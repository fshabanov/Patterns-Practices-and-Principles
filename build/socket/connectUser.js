"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _types_1 = require("../@types");
const state_1 = require("../state");
function connectUser(io, socket, username) {
    if (io.sockets.sockets.has(username)) {
        socket.emit(_types_1.Events.USER_EXISTS, { message: "Username already exists" });
        socket.disconnect();
        return;
    }
    io.sockets.sockets.set(username, socket);
    state_1.users.set(socket.id, {
        username,
        isReady: false,
        progress: 0,
        accuracy: 0,
        wpm: 0,
        socketId: socket.id,
    });
    console.log(`${username} connected`);
}
exports.default = connectUser;
