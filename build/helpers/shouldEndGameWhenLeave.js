"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const state_1 = require("../state");
const getRoomUsers_1 = __importDefault(require("./getRoomUsers"));
function shouldEndGameWhenLeave(io, roomName) {
    const roomUsers = (0, getRoomUsers_1.default)(io, roomName);
    if (roomUsers) {
        for (let user of Array.from(roomUsers)) {
            let foundUser = state_1.users.get(user);
            if (foundUser && (foundUser === null || foundUser === void 0 ? void 0 : foundUser.progress) < 100) {
                return false;
            }
        }
    }
    return true;
}
exports.default = shouldEndGameWhenLeave;
