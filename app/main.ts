import {bootstrap} from '@angular/platform-browser-dynamic';
import {provide} from '@angular/core';
import {disableDeprecatedForms, provideForms} from '@angular/forms';
import {Title} from '@angular/platform-browser';
import {Http, HTTP_PROVIDERS} from '@angular/http';
import {AuthHttp, AuthConfig} from 'angular2-jwt';
import {WEB_STORAGE_PROVIDERS} from 'h5webstorage';
import {LocalStorage, SessionStorage} from 'h5webstorage';

import {AppComponent} from './app.component';
import {appRouterProviders} from './app.routes';


bootstrap(AppComponent, [
	appRouterProviders,
	disableDeprecatedForms(),
	provideForms(),
	Title,
	HTTP_PROVIDERS,
	provide(AuthHttp, {
		useFactory: (http, localStorage, sessionStorage) => {
			return new AuthHttp(new AuthConfig({
				tokenGetter: () => {
					// Look in session storage for id_token, but fallback to local storage
					return sessionStorage['id_token'] || localStorage['id_token'];
				},
				noJwtError: true
			}), http);
		},
    	deps: [Http, LocalStorage, SessionStorage]
  }),
  WEB_STORAGE_PROVIDERS
]);
