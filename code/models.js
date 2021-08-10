"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ftuser = exports.fitRec = exports.fitData = void 0;
class fitData {
    constructor(id, amount, created_at, updated_at, fitrecid) {
        this.id = id;
        this.amount = amount;
        this.created_at = created_at;
        this.updated_at = updated_at;
        this.fitrecid = fitrecid;
    }
}
exports.fitData = fitData;
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
