import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'type'
})
export class TypeNamePipe implements PipeTransform {

    transform(value: any, args: string = null): string | boolean {
        const name = value && value.constructor && value.constructor.name || null;
        if (args === null) {
            return name;
        } else {
            return name === args;
        }
    }

}
