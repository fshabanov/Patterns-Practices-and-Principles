"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const _types_1 = require("../@types");
const state_1 = require("../state");
const startTimer_1 = __importDefault(require("./startTimer"));
function userReady(io, socket, isReady, roomName) {
    state_1.users.set(socket.id, Object.assign(Object.assign({}, state_1.users.get(socket.id)), { isReady: isReady }));
    io.to(roomName).emit(_types_1.Events.USER_READY, Object.assign({}, state_1.users.get(socket.id)));
    (0, startTimer_1.default)(io, roomName);
}
exports.default = userReady;
