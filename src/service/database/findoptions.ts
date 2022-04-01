export class FindOptions {
    public skip: number;
    public limit: number;

    constructor(){
        this.limit = 0;
        this.skip = 0;
    }
}