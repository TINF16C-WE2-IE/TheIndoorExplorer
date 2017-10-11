export class Map {
    public favorite: boolean;
    public name: string;
    public id: string;
    public permission: number;

    constructor(favorite: boolean, name: string, id: string, permission: number) {
        this.name = name;
        this.id = id;
        this.favorite = favorite;
        this.permission = permission;
    }
}
