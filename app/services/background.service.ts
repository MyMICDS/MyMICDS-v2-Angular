import * as config from '../common/config';

import {Injectable} from '@angular/core';
import {RequestOptions} from '@angular/http';
import {AuthHttp} from 'angular2-jwt';
import {xhrHeaders, handleError} from '../common/http-helpers';
import {Observable} from 'rxjs/Observable';
import '../common/rxjs-operators';

import {AuthService} from '../services/auth.service';

@Injectable()
export class BackgroundService {

	constructor(private authHttp: AuthHttp, private authService: AuthService) {}

	get() {
		let body = JSON.stringify({});
        let headers = xhrHeaders();
        let options = new RequestOptions({ headers });

        return this.authHttp.post(config.backendURL + '/background/get', body, options)
            .map(res => {
                let data = res.json();

				// Check if server-side error
				if(data.error) {
					throw new Error(data.error);
				}

				// Set background image
				this.set(data.variants);

                return {
					variants: data.variants,
					hasDefault: data.hasDefault
				};
            })
			.catch(handleError);
	}

	set(variants:any) {
		document.body.style.backgroundImage = 'url("' + variants.normal + '")';
	}

	upload(file:File) {
		return Observable.create(observer => {

			let formData = new FormData();
			let xhr = new XMLHttpRequest();

			formData.append('background', file, file.name);

			xhr.onreadystatechange = () => {
				if(xhr.readyState === 4) {
					if(xhr.status === 200) {
						let data = JSON.parse(xhr.response);

						// Check for any server-side error
						if(data.error) {
							observer.error(data.error);
							observer.complete();
							return;
						}

						observer.next();
					} else {
						// Something went wrong in the XHR Request
						observer.error(xhr.response);
					}
					observer.complete();
				}
			}

			xhr.upload.onprogress = (event) => {
				/** @TODO We can do something with this if we want */
	            let progress = Math.round(event.loaded / event.total * 100);
	        };

			// Get JWT to send with header
			let jwt = this.authService.getJWT();

			xhr.open('POST', config.backendURL + '/background/upload', true);

			// Set headers
			xhr.setRequestHeader('Authorization', 'Bearer ' + jwt);
			xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');

        	xhr.send(formData);
		});
	}

	delete() {
		let body = JSON.stringify({});
        let headers = xhrHeaders();
        let options = new RequestOptions({ headers });

        return this.authHttp.post(config.backendURL + '/background/delete', body, options)
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
