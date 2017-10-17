import { Floor } from './floor.class';

export class Map {
    public favorite: boolean;
    public name: string;
    public id: string;
    public map: Floor[];
    public permission: number;

    constructor(favorite: boolean, name: string, id: string, permission: number, map: Floor[]) {
        this.name = name;
        this.id = id;
        this.map = map;
        this.favorite = favorite;
        this.permission = permission;
    }
}
