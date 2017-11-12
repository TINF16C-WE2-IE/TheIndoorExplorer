import { Selectable } from './selectable.interface';

export interface Teleporter extends Selectable {
    group: number;
}


export function isTeleporter(obj: Teleporter | any): obj is Teleporter {
    return (obj && obj.group !== undefined);
}
