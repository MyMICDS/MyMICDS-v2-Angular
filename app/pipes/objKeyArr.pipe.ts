import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'keyArr'})
export class objKeyArrPipe implements PipeTransform {
  transform(obj: Object): Array<string> {
    let keys = [];
    for (let key in obj) {      
        if (obj.hasOwnProperty(key)) keys.push(key);
    }
    return keys
  }
}