"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const _types_1 = require("../@types");
const state_1 = require("../state");
const getRoomUsers_1 = __importDefault(require("../helpers/getRoomUsers"));
const shouldEndGameWhenLeave_1 = __importDefault(require("../helpers/shouldEndGameWhenLeave"));
const shouldShowRoom_1 = __importDefault(require("../helpers/shouldShowRoom"));
const endGame_1 = __importDefault(require("./endGame"));
function leaveRoom(io, socket, room) {
    var _a, _b, _c;
    socket.leave(room);
    (_a = state_1.roomProgress[room]) === null || _a === void 0 ? void 0 : _a.delete(socket.id);
    (0, shouldShowRoom_1.default)(io, room) &&
        io.emit(_types_1.Events.UPDATE_ROOMS, {
            name: room,
            numberOfUsers: ((_b = (0, getRoomUsers_1.default)(io, room)) === null || _b === void 0 ? void 0 : _b.size) || 0,
        });
    state_1.users.set(socket.id, Object.assign(Object.assign({}, state_1.users.get(socket.id)), { isReady: false }));
    if (!((_c = (0, getRoomUsers_1.default)(io, room)) === null || _c === void 0 ? void 0 : _c.size)) {
        io.sockets.adapter.rooms.delete(room);
        io.emit(_types_1.Events.REMOVE_ROOM, {
            name: room,
        });
        state_1.startedGameRooms.delete(room);
        return state_1.rooms.filter((r) => r !== room);
    }
    io.to(room).emit(_types_1.Events.LEAVE_ROOM, Object.assign({}, state_1.users.get(socket.id)));
    if ((0, shouldEndGameWhenLeave_1.default)(io, room)) {
        (0, endGame_1.default)(io, socket, true, room);
    }
    return state_1.rooms;
}
exports.default = leaveRoom;
