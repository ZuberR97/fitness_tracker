
export class fitData {
    public id: number;
    public amount: number;
    public created_at: Date;
    public updated_at: Date;
    public fitrecid: number;

    constructor(id: number, amount: number, created_at: Date, updated_at: Date, fitrecid: number) {
        this.id = id;
        this.amount = amount;
        this.created_at = created_at;
        this.updated_at = updated_at;
        this.fitrecid = fitrecid;
    }
}

export class fitRec {
    public id: number;
    public name: string;
    public fdata: fitData[];
    public created_at: Date;
    public updated_at: Date;
    public userid: number;

    constructor(id: number, name: string, fdata: fitData[], created_at: Date, updated_at: Date, userid: number) {
        this.id = id;
        this.name = name;
        this.fdata = [];
        this.created_at = created_at;
        this.updated_at = updated_at;
        this.userid = userid;
    }
}

export class ftuser {
    public id: number;
    public username: string;
    public password: string;
    public created_at: Date;
    public updated_at: Date;
    public fitrecs: fitRec[];

    constructor(id: number, username: string, password: string, created_at: Date, updated_at: Date) {
        this.id = id;
        this.username = username;
        this.password = password;
        this.created_at = created_at;
        this.updated_at = updated_at;
        this.fitrecs = [];
    }
}