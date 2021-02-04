
export class fitRec {
    public id: number;
    public created_at: Date;
    public walking_minutes: number;
    public pushups: number;
    public plank_seconds: number;
    public userid: number;

    constructor(id: number, created_at: Date, walking_minutes: number, pushups: number, plank_seconds: number, userid: number) {
        this.id = id;
        this.created_at = created_at;
        this.walking_minutes = walking_minutes;
        this.pushups = pushups;
        this.plank_seconds = plank_seconds;
        this.userid = userid;
    }
}
//add validations: https://www.npmjs.com/package/node-input-validator   https://express-validator.github.io/docs/

export class ftuser {
    public id: number;
    public username: string; //username will need to be unique
    public password: string; //password needs to be hashed
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