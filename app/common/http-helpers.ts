import {Response} from '@angular/http';
import {Observable} from 'rxjs/Observable';

// Generate error to display to user
export function handleError(error:any) {
	// Check if server-side error
	if(typeof error === 'string') {
		return Observable.throw(error);
	}
	// Check if client-side error
	return Observable.throw(error.message);
}
