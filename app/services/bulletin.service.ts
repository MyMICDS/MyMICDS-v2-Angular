import * as config from '../common/config';

import {Injectable} from '@angular/core' 
import {Http} from '@angular/http';
import {AuthHttp} from 'angular2-jwt';
import {xhrHeaders, handleError} from '../common/http-helpers';
import '../common/rxjs-operators';

@Injectable() 
export class BulletinService{
    constructor(private http: Http, private authHttp: AuthHttp) {}

    getBulletin() {
        let body = JSON.stringify({});
        let headers = xhrHeaders();
        let options = { headers };
        return this.http.post(config.backendURL+"/daily-bulletin/list", body, options)
            .map(res => {
                let data = res.json();

                // Check if server-side error
				if(data.error) {
					return handleError(data.error);
				}

                
            })
    }
}