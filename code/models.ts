
export class fitRec {
    public id: number;
    public created_at: Date;
    public walking_minutes: number;
    public pushups: number;
    public plank_seconds: number;

    constructor(id: number, created_at: Date, walking_minutes: number, pushups: number, plank_seconds: number) {
        this.id = id;
        this.created_at = created_at;
        this.walking_minutes = walking_minutes;
        this.pushups = pushups;
        this.plank_seconds = plank_seconds;
    }
}
//add validations

export class ftuser {
    public id: number;
    public username: string; //username will need to be unique
    private password: string; //password needs to be hashed
    public created_at: Date;
    public updated_at: Date;

    constructor(id: number, username: string, password: string, created_at: Date, updated_at: Date) {
        this.id = id;
        this.username = username;
        this.password = password;
        this.created_at = created_at;
        this.updated_at = updated_at;
    }
}