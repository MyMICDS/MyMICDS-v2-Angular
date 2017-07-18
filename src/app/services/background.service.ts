import { environment } from '../../environments/environment';

import { Injectable } from '@angular/core';
import { RequestOptions } from '@angular/http';
import { AuthHttp } from 'angular2-jwt';
import { xhrHeaders, handleError } from '../common/http-helpers';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import '../common/rxjs-operators';

import { AlertService } from './alert.service';
import { AuthService } from './auth.service';

declare const Trianglify: any;

@Injectable()
export class BackgroundService {

	private backgroundChangeSource = new Subject();
	backgroundChange$ = this.backgroundChangeSource.asObservable();

	variants = {
		normal: environment.backendURL + '/user-backgrounds/default/normal.jpg',
		blur: environment.backendURL + '/user-backgrounds/default/blur.jpg'
	};
	hasDefault = true;

	constructor(private authHttp: AuthHttp, private alertService: AlertService, private authService: AuthService) { }

	// Start getting of user's backgrounds and stuff
	initialize() {
		this.authService.auth$
			.switchMap(() => this.get())
			.subscribe(
				({ variants, hasDefault }) => {
					this.variants = variants;
					this.hasDefault = hasDefault;
					this.set();
				},
				error => {
					this.alertService.addAlert('danger', 'Get Background Error!', error);
				}
			);
	}

	get() {
		let body = JSON.stringify({});
		let headers = xhrHeaders();
		let options = new RequestOptions({ headers });

		return this.authHttp.post(environment.backendURL + '/background/get', body, options)
			.map(res => {
				let data = res.json();

				// Check if server-side error
				if (data.error) {
					throw new Error(data.error);
				}

				return {
					variants: this.variants,
					hasDefault: this.hasDefault
				};
			})
			.catch(handleError);
	}

	set() {
		document.body.style.backgroundImage = 'url("' + this.variants.normal + '")';
		this.backgroundChangeSource.next(this.variants.blur);
	}

	upload(file: File) {
		return Observable.create(observer => {

			let formData = new FormData();
			let xhr = new XMLHttpRequest();

			formData.append('background', file, file.name);

			xhr.onreadystatechange = () => {
				if (xhr.readyState === 4) {
					if (xhr.status === 200) {
						let data = JSON.parse(xhr.response);

						// Check for any server-side error
						if (data.error) {
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
			};

			xhr.upload.onprogress = (event) => {
				/** @TODO We can do something with this if we want */
				let progress = Math.round(event.loaded / event.total * 100); // tslint:disable-line
			};

			// Get JWT to send with header
			let jwt = this.authService.getJWT();

			xhr.open('POST', environment.backendURL + '/background/upload', true);

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

		return this.authHttp.post(environment.backendURL + '/background/delete', body, options)
			.map(res => {
				let data = res.json();

				// Check if server-side error
				if (data.error) {
					throw new Error(data.error);
				}

				return;
			})
			.catch(handleError);
	}

	setTrianglify() {
		let bgURI = Trianglify({
			width: 1920,
			height: 1080,
			cell_size: Math.random() * 275 + 15,
			variance: Math.random()
		}).png();

		function dataURItoBlob(dataURI) {
			// convert base64 data component to raw binary data held in a string
			let byteString;
			if (dataURI.split(',')[0].indexOf('base64') >= 0) {
				byteString = atob(dataURI.split(',')[1]);
			}

			// separate out the mime component
			const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

			// write the bytes of the string to a typed array
			let ia = new Uint8Array(byteString.length);
			for (let i = 0; i < byteString.length; i++) {
				ia[i] = byteString.charCodeAt(i);
			}

			return new Blob([ia], { type: mimeString });
		}

		let bgBlob = dataURItoBlob(bgURI);
		let bgFile: File = new File([bgBlob], 'trianglify', { type: 'image/png' });
		return this.upload(bgFile);
	}
}
