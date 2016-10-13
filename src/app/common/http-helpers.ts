import { Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';

// Headers to be used with every Ajax request
export function xhrHeaders() {
	return new Headers({
		'Content-Type'    : 'application/json; charset=utf-8',
		'X-Requested-With': 'XMLHttpRequest'
	});
}

// Generate error to display to user
export function handleError(error: any) {

	// Check if error is string
	if (typeof error === 'string') {
		return Observable.throw(error);
	}

	// Check if error object
	if (typeof error.message === 'string') {
		return Observable.throw(error.message);
	}

	// Check if server-side error
	if (typeof error.error === 'string') {
		return Observable.throw(error.message);
	}

	// Check if client-side error
	if (typeof error.statusText === 'string') {
		return Observable.throw(error.statusText);
	}

	// Fallback to generic error
	return Observable.throw('Something went wrong connecting to MyMICDS.net!');
}
