"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const _types_1 = require("../@types");
const getRoomUsers_1 = __importDefault(require("../helpers/getRoomUsers"));
const state_1 = require("../state");
const joinRoom_1 = __importDefault(require("./joinRoom"));
function createRoom(io, socket) {
    socket.on(_types_1.Events.CREATE_ROOM, (roomName) => {
        var _a;
        if (io.sockets.adapter.rooms.has(roomName)) {
            socket.emit(_types_1.Events.ERROR, {
                message: "Room with this name already exists",
            });
            return;
        }
        state_1.rooms.push(roomName);
        socket.join(roomName);
        io.emit(_types_1.Events.CREATE_ROOM, {
            name: roomName,
            numberOfUsers: ((_a = (0, getRoomUsers_1.default)(io, roomName)) === null || _a === void 0 ? void 0 : _a.size) || 0,
        });
        (0, joinRoom_1.default)(io, socket, roomName);
    });
}
exports.default = createRoom;
