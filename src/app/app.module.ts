import { MyMICDS } from '@mymicds/sdk';
import { MyMICDSFactory } from './common/mymicds-sdk';

import { APP_INITIALIZER, ErrorHandler, NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule, Title } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { appRoutingProviders, routing } from './app.routing';
import { ColorPickerModule } from 'ngx-color-picker';

import { AngularFittextModule } from 'angular-fittext';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';

import * as Sentry from '@sentry/angular';

import { AlertComponent } from './components/alert/alert.component';
import { AlertDebugComponent } from './components/alert-debug/alert-debug.component';
import { AppComponent } from './app.component';
import { ConfettiComponent } from './components/confetti/confetti.component';
import { SummerComponent } from './components/summer/summer.component';

import { AlertService } from './services/alert.service';
import { BackgroundService } from './services/background.service';
// import { RealtimeService } from './services/realtime.service';

// newly created modules
import { AuthenticationModule } from './authentication/authentication.module';
import { environment } from '../environments/environment';
import { ServiceWorkerModule } from '@angular/service-worker';
import { SharedModule } from './shared/shared.module';

@NgModule({
	declarations: [
		AppComponent,
		AlertComponent,
		AlertDebugComponent,
		ConfettiComponent,
		SummerComponent
	],
	imports: [
		BrowserModule,
		FormsModule,
		ReactiveFormsModule,
		routing,
		ColorPickerModule,
		BrowserAnimationsModule,
		AngularFittextModule,
		SharedModule,
		AuthenticationModule,
		FontAwesomeModule,
		ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
	],
	providers: [
		{
			provide: MyMICDS,
			useFactory: MyMICDSFactory
		},
		appRoutingProviders,
		Title,
		AlertService,
		BackgroundService,
		// RealtimeService,
		// Sentry stuff for better traces, which is implemented in a custom error handler
		{
			provide: ErrorHandler,
			useValue: Sentry.createErrorHandler({
				showDialog: false
			})
		},
		{
			provide: Sentry.TraceService,
			deps: [Router]
		},
		{
			provide: APP_INITIALIZER,
			// eslint-disable-next-line @typescript-eslint/no-empty-function
			useFactory: () => () => {},
			deps: [Sentry.TraceService],
			multi: true
		}
	],
	bootstrap: [AppComponent]
})
export class AppModule {
	constructor(library: FaIconLibrary) {
		// Add an icon to the library for convenient access in other components
		library.addIconPacks(fas, fab);
	}
}
