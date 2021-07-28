"use strict";
// export class fitRec {
//     public id: number;
//     public created_at: Date;
//     public walking_minutes: number;
//     public pushups: number;
//     public plank_seconds: number;
//     public userid: number;
//     // users choose their own exercises and they are stored in an array. there is a separate array filled with numbers corresponding to the index of the exercise.
Object.defineProperty(exports, "__esModule", { value: true });
exports.ftuser = exports.fitRec = void 0;
//     constructor(id: number, created_at: Date, walking_minutes: number, pushups: number, plank_seconds: number, userid: number) {
//         this.id = id;
//         this.created_at = created_at;
//         this.walking_minutes = walking_minutes;
//         this.pushups = pushups;
//         this.plank_seconds = plank_seconds;
//         this.userid = userid;
//     }
// }
class fitData {
    constructor(id, amount, created_at, updated_at, fitrecid) {
        this.id = id;
        this.amount = amount;
        this.created_at = created_at;
        this.updated_at = updated_at;
        this.fitrecid = fitrecid;
    }
}
// class exercise {
//     public id: number;
//     public name: string;
//     public fdata: fitData[];
//     public created_at: Date;
//     public updated_at: Date;
//     constructor(id: number, name: string, fdata: fitData[], created_at: Date, updated_at: Date) {
//         this.id = id;
//         this.name = name;
//         this.fdata = [];
//         this.created_at = created_at;
//         this.updated_at = updated_at;
//     }
// }
class fitRec {
    constructor(id, name, fdata, created_at, updated_at, userid) {
        this.id = id;
        this.name = name;
        this.fdata = [];
        this.created_at = created_at;
        this.updated_at = updated_at;
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
