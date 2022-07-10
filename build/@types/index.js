"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Events = void 0;
var Events;
(function (Events) {
    Events["ERROR"] = "ERROR";
    Events["CREATE_ROOM"] = "CREATE_ROOM";
    Events["USER_EXISTS"] = "USER_EXISTS";
    Events["UPDATE_ROOMS"] = "UPDATE_ROOMS";
    Events["JOIN_ROOM"] = "JOIN_ROOM";
    Events["GET_ALL_ROOMS"] = "GET_ALL_ROOMS";
    Events["REMOVE_ROOM"] = "REMOVE_ROOM";
    Events["LEAVE_ROOM"] = "LEAVE_ROOM";
    Events["USER_READY"] = "USER_READY";
    Events["START_GAME"] = "START_GAME";
    Events["CHANGE_PROGRESS"] = "CHANGE_PROGRESS";
    Events["END_GAME"] = "END_GAME";
})(Events || (Events = {}));
exports.Events = Events;
