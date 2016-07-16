import {bootstrap} from '@angular/platform-browser-dynamic';
import { disableDeprecatedForms, provideForms } from '@angular/forms';
import {AppComponent} from './app.component';
import {appRouterProviders} from './app.routes';

bootstrap(AppComponent, [
	appRouterProviders, disableDeprecatedForms(), provideForms(),
]).then(
	() => window.console.info( 'Angular finished bootstrapping your application!' ),
	(error) => {
		console.warn( 'Angular was not able to bootstrap your application.' );
		console.error( error );
	}
);;
