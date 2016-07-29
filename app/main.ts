import {bootstrap} from '@angular/platform-browser-dynamic';
import {provide} from '@angular/core';
import {disableDeprecatedForms, provideForms} from '@angular/forms';
import {Title} from '@angular/platform-browser';
import {Http, HTTP_PROVIDERS} from '@angular/http';
import {AuthHttp, AuthConfig, JwtHelper} from 'angular2-jwt';
let jwtHelper = new JwtHelper();
import {WEB_STORAGE_PROVIDERS} from 'h5webstorage';

import {AppComponent} from './app.component';
import {appRouterProviders} from './app.routes';


bootstrap(AppComponent, [
	appRouterProviders,
	disableDeprecatedForms(),
	provideForms(),
	Title,
	HTTP_PROVIDERS,
	provide(AuthHttp, {
		useFactory: (http) => {
			return new AuthHttp(new AuthConfig({
				tokenGetter: () => {
					// Look in session storage for id_token, but fallback to local storage
					let session = sessionStorage.getItem('id_token');
					let local = localStorage.getItem('id_token');

					let token = session || local;

					// Remove any quotations from the sides
					if(typeof token === 'string') {
						token = token.split('"').join('');

						// Check if token is expired. If it is, delete and send user to login page
						if(jwtHelper.isTokenExpired(token)) {
							this.sessionStorage.removeItem('id_token');
							this.localStorage.removeItem('id_token');

							this.router.navigate(['/login']);
							return null;
						}
					}

					return token;
				},
				noJwtError: true
			}), http);
		},
    	deps: [Http]
	}),
	WEB_STORAGE_PROVIDERS
]);
