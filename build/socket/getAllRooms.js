"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const _types_1 = require("../@types");
const shouldShowRoom_1 = __importDefault(require("../helpers/shouldShowRoom"));
const state_1 = require("../state");
function getAllRooms(io, socket) {
    socket.emit(_types_1.Events.GET_ALL_ROOMS, {
        rooms: state_1.rooms.map((room) => {
            var _a;
            if ((0, shouldShowRoom_1.default)(io, room))
                return {
                    name: room,
                    numberOfUsers: ((_a = io.sockets.adapter.rooms.get(room)) === null || _a === void 0 ? void 0 : _a.size) || 0,
                };
        }),
    });
}
exports.default = getAllRooms;
