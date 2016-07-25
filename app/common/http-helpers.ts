import {Headers, Response} from '@angular/http';
import {Observable} from 'rxjs/Observable';

// Headers to be used with every Ajax request
export function xhrHeaders() {
	return new Headers({
		'Content-Type'    : 'application/json; charset=utf-8',
		'X-Requested-With': 'XMLHttpRequest'
	});
}

// Generate error to display to user
export function handleError(error:any) {
	console.log('Handel error!', error);
	// Check if server-side error
	if(typeof error === 'string') {
		throw new Error(error);
	}
	// Check if client-side error
	return Observable.throw(error.message);
}
