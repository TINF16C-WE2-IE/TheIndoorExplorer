export class Map {
    public favorite: boolean;
    public name: string;
    public id: string;
    public map: any;
    public permission: number;

    constructor(favorite: boolean, name: string, id: string, permission: number, map: any) {
        this.name = name;
        this.id = id;
        this.map = map;
        this.favorite = favorite;
        this.permission = permission;
    }
}
