import {bootstrap} from '@angular/platform-browser-dynamic';
import { disableDeprecatedForms, provideForms } from '@angular/forms';
import {AppComponent} from './app.component';
import {appRouterProviders} from './app.routes';
import { Title } from '@angular/platform-browser';


bootstrap(AppComponent, [
	appRouterProviders, disableDeprecatedForms(), provideForms(), Title
]).then(
	() => window.console.info( 'Angular finished bootstrapping your application!' ),
	(error) => {
		console.warn( 'Angular was not able to bootstrap your application.' );
		console.error( error );
	}
);;
