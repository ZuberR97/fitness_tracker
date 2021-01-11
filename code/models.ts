
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