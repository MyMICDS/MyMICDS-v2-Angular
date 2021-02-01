import { MyMICDS } from '@mymicds/sdk';
import { MyMICDSFactory } from './common/mymicds-sdk';

import { APP_INITIALIZER, ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule, Title } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { appRoutingProviders, routing } from './app.routing';
import { ColorPickerModule } from 'ngx-color-picker';

import { AngularFittextModule } from 'angular-fittext';
import { IconPickerModule } from 'ngx-icon-picker';
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';

import * as Sentry from '@sentry/angular';

import { AppComponent } from './app.component';
import { AlertComponent } from './components/alert/alert.component';
import { AlertDebugComponent } from './components/alert-debug/alert-debug.component';
import { ConfettiComponent } from './components/confetti/confetti.component';
import { SummerComponent } from './components/summer/summer.component';
import { QuotesComponent } from './components/quotes/quotes.component';

import { AlertService } from './services/alert.service';
import { BackgroundService } from './services/background.service';
import { GlobalErrorHandler } from "./services/global-error-handler.service";
// import { RealtimeService } from './services/realtime.service';

// newly created modules
import { SharedModule } from './shared/shared.module';
import { AuthenticationModule } from './authentication/authentication.module';


@NgModule({
	declarations: [
		AppComponent,
		AlertComponent,
		AlertDebugComponent,
		ConfettiComponent,
		SummerComponent,
		QuotesComponent
	],
	imports: [
		BrowserModule,
		FormsModule,
		ReactiveFormsModule,
		routing,
		ColorPickerModule,
		BrowserAnimationsModule,
		AngularFittextModule,
		IconPickerModule,
		SharedModule,
		AuthenticationModule,
		FontAwesomeModule
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
		// Sentry stuff for better traces
		{
			provide: ErrorHandler,
			useValue: GlobalErrorHandler,
		},
		{
			provide: ErrorHandler,
			useValue: Sentry.createErrorHandler({
				showDialog: true,
			})
		},
		{
			provide: Sentry.TraceService,
			deps: [Router],
		},
		{
			provide: APP_INITIALIZER,
			useFactory: () => () => {},
			deps: [Sentry.TraceService],
			multi: true,
		},
	],
	bootstrap: [AppComponent],

})
export class AppModule {
	constructor(library: FaIconLibrary) {
		// Add an icon to the library for convenient access in other components
		library.addIconPacks(fas, fab);
	}
}
