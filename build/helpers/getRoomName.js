"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function getRoomName(socket) {
    return Array.from(socket.rooms).filter((room) => room !== socket.id)[0];
}
exports.default = getRoomName;
