import {Headers, Response} from '@angular/http';
import {Observable} from 'rxjs/Observable';

// Headers to be used with every Ajax request
export function xhrHeaders() {
	const headers = new Headers();
	headers.append('Content-Type', 'application/json; charset=utf-8');
	headers.append('X-Requested-With', 'XMLHttpRequest');
	return headers;
}

// Generate error to display to user
export function handleError(error:any) {
	// Check if server-side error
	if(typeof error === 'string') {
		throw new Error(error);
	}
	// Check if client-side error
	return Observable.throw(error.message);
}
