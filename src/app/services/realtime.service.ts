import { environment } from '../../environments/environment';

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import * as io from 'socket.io-client';

@Injectable()
export class RealtimeService {

	private socket;

	constructor() {
		this.socket = io(environment.realtimeURL);
	}

	// Listens to a specific event
	listen(event: string) {
		return Observable.create(observer => {
			this.socket.on(event, (...args) => {
				observer.next(...args);
			});
		});
	}

	// Listens to a specific event only once
	once(event: string) {
		return Observable.create(observer => {
			this.socket.once(event, (...args) => {
				observer.next(...args);
			});
		});
	}

	// Emit a socket.io event
	emit(event: string, ...args) {
		if (this.socket) {
			this.socket.emit(event, ...args);
		}
	}
}
