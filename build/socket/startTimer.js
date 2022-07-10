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
const config = __importStar(require("./config"));
const data_1 = __importDefault(require("../data"));
const getRoomUsers_1 = __importDefault(require("../helpers/getRoomUsers"));
const state_1 = require("../state");
function startTimer(io, roomName) {
    const usersInRoom = (0, getRoomUsers_1.default)(io, roomName);
    if (!usersInRoom)
        return;
    if (Array.from(usersInRoom).every((user) => { var _a; return (_a = state_1.users.get(user)) === null || _a === void 0 ? void 0 : _a.isReady; }) &&
        !state_1.startedGameRooms.has(roomName)) {
        state_1.roomProgress[roomName] = new Set();
        state_1.startedGameRooms.add(roomName);
        const roomUsers = (0, getRoomUsers_1.default)(io, roomName);
        roomUsers === null || roomUsers === void 0 ? void 0 : roomUsers.forEach((user) => {
            state_1.users.set(user, Object.assign(Object.assign({}, state_1.users.get(user)), { progress: 0 }));
            io.to(roomName).emit(_types_1.Events.CHANGE_PROGRESS, Object.assign(Object.assign({}, state_1.users.get(user)), { progress: 0 }));
        });
        // if all users are ready, start the game
        io.to(roomName).emit(_types_1.Events.START_GAME, {
            timer: config.SECONDS_TIMER_BEFORE_START_GAME,
            duration: config.SECONDS_FOR_GAME,
            textIdx: Math.floor(Math.random() * (data_1.default.texts.length - 1)),
        });
        io.emit(_types_1.Events.REMOVE_ROOM, {
            name: roomName,
        });
    }
}
exports.default = startTimer;
