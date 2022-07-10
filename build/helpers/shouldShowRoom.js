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
Object.defineProperty(exports, "__esModule", { value: true });
const state_1 = require("../state");
const config = __importStar(require("../socket/config"));
function shouldShowRoom(io, roomName) {
    const usersInRoom = io.sockets.adapter.rooms.get(roomName);
    if (!usersInRoom || (usersInRoom === null || usersInRoom === void 0 ? void 0 : usersInRoom.size) >= config.MAXIMUM_USERS_FOR_ONE_ROOM)
        return false;
    return Array.from(usersInRoom).some((user) => { var _a; return !((_a = state_1.users.get(user)) === null || _a === void 0 ? void 0 : _a.isReady); });
}
exports.default = shouldShowRoom;
