
export class fitRec {
    public id: number;
    public created_at: Date;
    public exercises: string[];
    public exerciseStats: number[];
    public userid: number;
    // users choose their own exercises and they are stored in an array. there is a separate array filled with numbers corresponding to the index of the exercise.

    constructor(id: number, exercises: string[], exerciseStats: number[], created_at: Date, userid: number) {
        this.id = id;
        this.created_at = created_at;
        this.exercises = exercises;
        this.exerciseStats = exerciseStats;
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
    public exercises: exercise[];

    constructor(id: number, username: string, password: string, created_at: Date, updated_at: Date) {
        this.id = id;
        this.username = username;
        this.password = password;
        this.created_at = created_at;
        this.updated_at = updated_at;
        this.fitrecs = [];
        this.exercises = [];
    }
}

export class exercise {
    public id: number;
    public name: string;
    public created_at: Date;
    public updated_at: Date;

    constructor(id: number, name: string, created_at: Date, updated_at: Date) {
        this.id = id;
        this.name = name;
        this.created_at = created_at;
        this.updated_at = updated_at;
    }
}