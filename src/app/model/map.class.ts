import { Floor } from './floor.class';
import { Serializable } from './serializable.interface';


export class Map implements Serializable<Map>{
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


    fromObject(obj: {favorite: boolean, name: string, id: string, permission: number, map: any[]}): Map {
        return null;
    }

    toJson(): string {
        return null;
    }
}
