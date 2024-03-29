"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ftuser = exports.fitRec = void 0;
class fitRec {
    // users choose their own exercises and they are stored in an array. there is a separate array filled with numbers corresponding to the index of the exercise.
    constructor(id, created_at, walking_minutes, pushups, plank_seconds, userid) {
        this.id = id;
        this.created_at = created_at;
        this.walking_minutes = walking_minutes;
        this.pushups = pushups;
        this.plank_seconds = plank_seconds;
        this.userid = userid;
    }
}
exports.fitRec = fitRec;
class ftuser {
    constructor(id, username, password, created_at, updated_at) {
        this.id = id;
        this.username = username;
        this.password = password;
        this.created_at = created_at;
        this.updated_at = updated_at;
        this.fitrecs = [];
    }
}
exports.ftuser = ftuser;
