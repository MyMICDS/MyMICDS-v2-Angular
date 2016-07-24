import * as config from '../common/config';

import {Injectable} from '@angular/core';
import {AuthHttp} from 'angular2-jwt';
import {xhrHeaders, handleError} from '../common/http-helpers';
import '../common/rxjs-operators';

@Injectable()
export class BackgroundService {

	constructor(private authHttp: AuthHttp) {}

	getBackground() {
		let body = JSON.stringify({});
        let headers = xhrHeaders();
        let options = { headers };

        return this.http.post(config.backendURL + '/background/get', body, options)
            .map(res => {
                let data = res.json();

                // Check if server-side error
				if(data.error) {
					return handleError(data.error);
				}

                return data.urls;
            })
			.catch(handleError);
	}

	deleteBackground() {
		let body = JSON.stringify({});
        let headers = xhrHeaders();
        let options = { headers };

        return this.http.post(config.backendURL + '/background/delete', body, options)
            .map(res => {
                let data = res.json();

                // Check if server-side error
				if(data.error) {
					return handleError(data.error);
				}

                return;
            })
			.catch(handleError);
	}

}
