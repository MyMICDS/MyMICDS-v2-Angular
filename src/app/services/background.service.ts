import { environment } from '../../environments/environment';

import { Injectable } from '@angular/core';
import { AuthHttp } from 'angular2-jwt';
import { BehaviorSubject } from 'rxjs/Rx';
import '../common/rxjs-operators';

import { AlertService } from './alert.service';
import { AuthService } from './auth.service';

declare const Trianglify: any;

@Injectable()
export class BackgroundService {

	background$ = new BehaviorSubject<Background>({
		hasDefault: true,
		variants: {
			normal: environment.backendURL + '/user-backgrounds/default/normal.jpg',
			blur: environment.backendURL + '/user-backgrounds/default/blur.jpg'
		}
	});

	constructor(private authHttp: AuthHttp, private alertService: AlertService, private authService: AuthService) { }

	// Start getting of user's backgrounds and stuff
	initialize() {
		this.authService.auth$
			.switchMap(() => this.get())
			.subscribe(
				background => {
					this.set(background);
				},
				error => {
					this.alertService.addAlert('danger', 'Get Background Error!', error);
				}
			);
	}

	private set(background: Background) {
		this.background$.next(background);
		document.body.style.backgroundImage = 'url("' + background.variants.normal + '")';
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
		return new File([bgBlob], 'trianglify', { type: 'image/png' });
	}
}
