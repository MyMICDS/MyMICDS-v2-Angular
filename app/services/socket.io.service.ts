import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import * as io from 'socket.io-client';
import {backendURL} from '../common/config'

@Injectable()
export class SocketioService {
    constructor() {
        
    }

    private socket;

    getTagState() {
        return new Observable(observer => {
            this.socket = io(backendURL);
            this.socket.on('clickTag', (data) => {
                observer.next(data);    
            });
            return () => {
                this.socket.disconnect();
            };  
        })
    }

    send(event, data) {

    }
}
