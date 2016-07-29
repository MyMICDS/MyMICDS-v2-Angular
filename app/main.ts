import {bootstrap} from '@angular/platform-browser-dynamic';
import {provide} from '@angular/core';
import {disableDeprecatedForms, provideForms} from '@angular/forms';
import {Title} from '@angular/platform-browser';
import {Http, HTTP_PROVIDERS} from '@angular/http';
import {AuthHttp, AuthConfig} from 'angular2-jwt';
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
