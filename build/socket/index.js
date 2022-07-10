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
const getRoomName_1 = __importDefault(require("../helpers/getRoomName"));
const getRoomUsers_1 = __importDefault(require("../helpers/getRoomUsers"));
const config = __importStar(require("./config"));
const createRoom_1 = __importDefault(require("./createRoom"));
const endGame_1 = __importDefault(require("./endGame"));
const getAllRooms_1 = __importDefault(require("./getAllRooms"));
const joinRoom_1 = __importDefault(require("./joinRoom"));
const leaveRoom_1 = __importDefault(require("./leaveRoom"));
const startTimer_1 = __importDefault(require("./startTimer"));
const userReady_1 = __importDefault(require("./userReady"));
const connectUser_1 = __importDefault(require("./connectUser"));
exports.default = (io) => {
    io.on("connection", (socket) => {
        const username = socket.handshake.query.username;
        (0, connectUser_1.default)(io, socket, username);
        (0, getAllRooms_1.default)(io, socket);
        (0, createRoom_1.default)(io, socket);
        socket.on(_types_1.Events.JOIN_ROOM, (roomName) => {
            const roomUsers = (0, getRoomUsers_1.default)(io, roomName);
            if (roomUsers === null || roomUsers === void 0 ? void 0 : roomUsers.has(socket.id))
                return;
            if (((roomUsers === null || roomUsers === void 0 ? void 0 : roomUsers.size) || 0) >= config.MAXIMUM_USERS_FOR_ONE_ROOM) {
                socket.emit(_types_1.Events.ERROR, {
                    message: "Room is full",
                });
                return;
            }
            socket.join(roomName);
            roomUsers === null || roomUsers === void 0 ? void 0 : roomUsers.add(socket.id);
            const numOfUsers = (roomUsers === null || roomUsers === void 0 ? void 0 : roomUsers.size) || 0;
            if (numOfUsers >= config.MAXIMUM_USERS_FOR_ONE_ROOM) {
                io.emit(_types_1.Events.REMOVE_ROOM, {
                    name: roomName,
                });
            }
            else {
                io.emit(_types_1.Events.UPDATE_ROOMS, {
                    name: roomName,
                    numberOfUsers: (roomUsers === null || roomUsers === void 0 ? void 0 : roomUsers.size) || 0,
                });
            }
            (0, joinRoom_1.default)(io, socket, roomName);
        });
        socket.on(_types_1.Events.LEAVE_ROOM, (roomName) => {
            (0, state_1.setRooms)((0, leaveRoom_1.default)(io, socket, roomName));
            (0, startTimer_1.default)(io, roomName);
        });
        socket.on(_types_1.Events.USER_READY, (data) => {
            (0, userReady_1.default)(io, socket, data.isReady, data.roomName);
        });
        socket.on(_types_1.Events.CHANGE_PROGRESS, (data) => {
            state_1.users.set(socket.id, Object.assign(Object.assign({}, state_1.users.get(socket.id)), data));
            const roomName = (0, getRoomName_1.default)(socket);
            if (data.progress === 100) {
                if (!state_1.roomProgress[roomName]) {
                    state_1.roomProgress[roomName] = new Set();
                }
                state_1.roomProgress[roomName].add(socket.id);
            }
            io.to(roomName).emit(_types_1.Events.CHANGE_PROGRESS, Object.assign({}, state_1.users.get(socket.id)));
            const roomUsers = (0, getRoomUsers_1.default)(io, roomName);
            // If all users are finished, end the game
            if (state_1.roomProgress[roomName].size === (roomUsers === null || roomUsers === void 0 ? void 0 : roomUsers.size)) {
                (0, endGame_1.default)(io, socket, true);
            }
        });
        socket.on(_types_1.Events.END_GAME, () => {
            (0, endGame_1.default)(io, socket);
        });
        socket.on("disconnecting", () => {
            const connectedRooms = Array.from(socket.rooms).slice(1);
            connectedRooms.forEach((room) => {
                (0, state_1.setRooms)((0, leaveRoom_1.default)(io, socket, room));
                (0, startTimer_1.default)(io, room);
            });
            state_1.users.delete(socket.id);
        });
        socket.on("disconnect", () => {
            console.log(`${username} disconnected`);
            io.sockets.sockets.delete(username);
        });
    });
};
