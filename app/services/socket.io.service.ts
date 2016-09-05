import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import * as io from 'socket.io-client';
import {backendURL} from '../common/config'

@Injectable()
export class SocketioService {
    constructor() {
    }

    private socket;

    //listens to a specific event and convert the data stream into an observable
    listen(event:string) {
        return new Observable(observer => {
            this.socket = io.connect(backendURL);
            this.socket.on(event, (data) => {
                observer.next(data);
            });
            return () => {
                this.socket.disconnect();
            };  
        })
    }

    //emit a socket.io event
    emit(event:string, data:any) {
        if (this.socket) {this.socket.emit(event, data);}
    }
}
