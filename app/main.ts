import {bootstrap} from '@angular/platform-browser-dynamic';
import {disableDeprecatedForms, provideForms} from '@angular/forms';
import {Title} from '@angular/platform-browser';
import {HTTP_PROVIDERS} from '@angular/http'
import {AUTH_PROVIDERS} from 'angular2-jwt';

import {AppComponent} from './app.component';
import {appRouterProviders} from './app.routes';


bootstrap(AppComponent, [
	appRouterProviders,
	disableDeprecatedForms(),
	provideForms(),
	Title,
	HTTP_PROVIDERS,
	AUTH_PROVIDERS
]);
