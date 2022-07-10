"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const config = __importStar(require("./config"));
function leaveRoom(io, socket, room) {
    var _a, _b, _c, _d;
    socket.leave(room);
    (_a = state_1.roomProgress[room]) === null || _a === void 0 ? void 0 : _a.delete(socket.id);
    if ((0, shouldShowRoom_1.default)(io, room)) {
        const numOfUsers = ((_b = (0, getRoomUsers_1.default)(io, room)) === null || _b === void 0 ? void 0 : _b.size) || 0;
        // there were max num of people, one left
        if (numOfUsers === config.MAXIMUM_USERS_FOR_ONE_ROOM - 1) {
            io.emit(_types_1.Events.CREATE_ROOM, {
                name: room,
                numberOfUsers: numOfUsers,
            });
        }
        else {
            io.emit(_types_1.Events.UPDATE_ROOMS, {
                name: room,
                numberOfUsers: ((_c = (0, getRoomUsers_1.default)(io, room)) === null || _c === void 0 ? void 0 : _c.size) || 0,
            });
        }
    }
    state_1.users.set(socket.id, Object.assign(Object.assign({}, state_1.users.get(socket.id)), { isReady: false }));
    if (!((_d = (0, getRoomUsers_1.default)(io, room)) === null || _d === void 0 ? void 0 : _d.size)) {
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
