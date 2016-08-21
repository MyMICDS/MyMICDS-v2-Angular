import * as config from '../common/config';

import {Injectable} from '@angular/core';
import {RequestOptions} from '@angular/http';
import {AuthHttp} from 'angular2-jwt';
import {xhrHeaders, handleError} from '../common/http-helpers';
import '../common/rxjs-operators';

@Injectable()
export class AliasService {
    constructor(private authHttp: AuthHttp) {}

	addAlias(type:string, classString:string, classId:string) {
		let body = JSON.stringify({ type, classString, classId });
		let headers = xhrHeaders();
        let options = new RequestOptions({ headers });

        return this.authHttp.post(config.backendURL + '/alias/add', body, options)
			.map(res => {
				let data = res.json();

				// Check if server-side error
				if(data.error) {
					throw new Error(data.error);
				}

				return data.id;
			})
			.catch(handleError);
    }

	listAliases() {
		let body = JSON.stringify({});
		let headers = xhrHeaders();
        let options = new RequestOptions({ headers });

        return this.authHttp.post(config.backendURL + '/alias/list', body, options)
			.map(res => {
				let data = res.json();

				// Check if server-side error
				if(data.error) {
					throw new Error(data.error);
				}

				return data.aliases;
			})
			.catch(handleError);
    }

	deleteAlias(type:string, id:string) {
		let body = JSON.stringify({ type, id });
		let headers = xhrHeaders();
        let options = new RequestOptions({ headers });

        return this.authHttp.post(config.backendURL + '/alias/delete', body, options)
			.map(res => {
				let data = res.json();

				// Check if server-side error
				if(data.error) {
					throw new Error(data.error);
				}

				return;
			})
			.catch(handleError);
    }
}
