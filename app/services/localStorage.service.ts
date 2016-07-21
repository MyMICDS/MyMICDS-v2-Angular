import {Injectable, EventEmitter} from '@angular/core';

@Injectable()
export class LocalStorageService {

    public setItem$: EventEmitter<{}>;
    public removeItem$: EventEmitter<{}>;
    public getItem$: EventEmitter<{}>;
    public clear$: EventEmitter<{}>;

    constructor () {
        this.setItem$ = new EventEmitter();
        this.removeItem$ = new EventEmitter();
        this.getItem$ = new EventEmitter();
    }

    public setItem(index:string, value:string) {
        localStorage.setItem(index, value);
        this.setItem$.emit({index,value});
    }

    public removeItem(index:string) {
        localStorage.removeItem(index);
        this.removeItem$.emit({index})
    }

    public getItem(index:string) {
        this.getItem$.emit({index});
        return localStorage.getItem(index);
    }

    public clear() {
        this.clear$.emit(true);
        localStorage.clear();
    }
}