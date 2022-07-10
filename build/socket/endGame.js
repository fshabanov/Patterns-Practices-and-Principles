"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const _types_1 = require("../@types");
const getRoomName_1 = __importDefault(require("../helpers/getRoomName"));
const getRoomUsers_1 = __importDefault(require("../helpers/getRoomUsers"));
const shouldShowRoom_1 = __importDefault(require("../helpers/shouldShowRoom"));
const state_1 = require("../state");
function endGame(io, socket, sendAll = false, customRoomName) {
    var _a;
    const roomName = customRoomName ? customRoomName : (0, getRoomName_1.default)(socket);
    const roomUsers = (0, getRoomUsers_1.default)(io, roomName);
    if (roomUsers) {
        const toAdd = [];
        roomUsers.forEach((user) => {
            var _a;
            const userInfo = state_1.users.get(user);
            if (!((_a = state_1.roomProgress[roomName]) === null || _a === void 0 ? void 0 : _a.has(user))) {
                toAdd.push(userInfo);
            }
        });
        toAdd.sort((a, b) => {
            return b.progress - a.progress === 0
                ? b.accuracy - a.accuracy
                : b.progress - a.progress;
        });
        let userOrder = Array.from(state_1.roomProgress[roomName])
            .map((socketId) => state_1.users.get(socketId))
            .concat(toAdd);
        if (sendAll) {
            io.to(roomName).emit(_types_1.Events.END_GAME, {
                userOrder: userOrder.filter((usr) => roomUsers.has(usr === null || usr === void 0 ? void 0 : usr.socketId)),
            });
        }
        else {
            socket.emit(_types_1.Events.END_GAME, {
                userOrder: userOrder.filter((usr) => roomUsers.has(usr === null || usr === void 0 ? void 0 : usr.socketId)),
            });
        }
    }
    state_1.startedGameRooms.delete(roomName);
    roomUsers === null || roomUsers === void 0 ? void 0 : roomUsers.forEach((user) => {
        state_1.users.set(user, Object.assign(Object.assign({}, state_1.users.get(user)), { isReady: false, progress: 0 }));
        io.to(roomName).emit(_types_1.Events.USER_READY, Object.assign(Object.assign({}, state_1.users.get(user)), { isReady: false }));
    });
    if ((0, shouldShowRoom_1.default)(io, roomName) && !state_1.wasEndGameInfoSent[roomName]) {
        io.emit(_types_1.Events.CREATE_ROOM, {
            name: roomName,
            numberOfUsers: ((_a = (0, getRoomUsers_1.default)(io, roomName)) === null || _a === void 0 ? void 0 : _a.size) || 0,
        });
        state_1.wasEndGameInfoSent[roomName] = true;
    }
}
exports.default = endGame;
