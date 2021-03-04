import { environment } from '../../environments/environment';

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import * as io from 'socket.io-client';

@Injectable()
export class RealtimeService {
	private socket = io(environment.realtimeURL);

	// Listens to a specific event
	listen(event: string) {
		return new Observable(observer => {
			this.socket.on(event, (...args: unknown[]) => {
				observer.next(...args);
			});
		});
	}

	// Listens to a specific event only once
	once(event: string) {
		return new Observable(observer => {
			this.socket.once(event, (...args: unknown[]) => {
				observer.next(...args);
			});
		});
	}

	// Emit a socket.io event
	emit(event: string, ...args: unknown[]) {
		if (this.socket) {
			this.socket.emit(event, ...args);
		}
	}
}
