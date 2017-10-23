import { Floor } from './floor.class';

export class Map {
    public id: number;
    public name: string;
    public floors: Floor[];
    public favorite: boolean;
    public permission: number;
    public visibility: number;


    constructor(obj: {
        id: number, name: string, floors?: any[],
        favorite: boolean, permission: number, visibility: number
    }) {
        this.id = obj.id;
        this.name = obj.name;
        this.floors = obj.floors ? obj.floors.map(floor_obj => new Floor(floor_obj)) : null;
        this.favorite = obj.favorite;
        this.permission = obj.permission;
        this.visibility = obj.visibility;
    }
}
