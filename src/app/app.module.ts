import { MyMICDS } from '@mymicds/sdk';
import { MyMICDSFactory } from './common/mymicds-sdk';

import { NgModule } from '@angular/core';
import { BrowserModule, Title } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { appRoutingProviders, routing } from './app.routing';
import { ColorPickerModule } from 'ngx-color-picker';
import {
	ModalModule,
	PopoverModule,
	TooltipModule
} from 'ngx-bootstrap';
import { AngularFittextModule } from 'angular-fittext';
import { IconPickerModule } from 'ngx-icon-picker';
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';

import { AppComponent } from './app.component';
import { AlertComponent } from './components/alert/alert.component';
import { AlertDebugComponent } from './components/alert-debug/alert-debug.component';
import { ConfettiComponent } from './components/confetti/confetti.component';
import { SportsComponent } from './components/sports/sports.component';
import { SummerComponent } from './components/summer/summer.component';
import { QuotesComponent } from './components/quotes/quotes.component';

import { AlertService } from './services/alert.service';
import { BackgroundService } from './services/background.service';
// import { RealtimeService } from './services/realtime.service';
// RxJS 6 Zone.js Fix
// import 'zone.js/dist/zone-patch-rxjs';

// newly created modules
import { SharedModule } from './shared/shared.module';
// import { HomeModule } from './home/home.module';
// import { AboutModule } from './about/about.module';
// import { CampusLifeModule } from './campus-life/campus-life.module';
// import { DailyBulletinModule } from './daily-bulletin/daily-bulletin.module';
// import { LunchModule } from './lunch/lunch.module';
// import { PlannerModule } from './planner/planner.module';
// import { SettingsModule } from './settings/settings.module';

import { AuthenticationModule } from './authentication/authentication.module';
// import { UnsubscribeModule } from './unsubscribe/unsubscribe.module';
// import { ResetPasswordModule } from './reset-password/reset-password.module';
// import { ConfirmModule } from './confirm/confirm.module';

@NgModule({
	declarations: [
		// Components
		AppComponent,
		AlertComponent,
		AlertDebugComponent,
		ConfettiComponent,
		SportsComponent,
		SummerComponent,
		QuotesComponent
	],
	imports: [
		BrowserModule,
		FormsModule,
		ReactiveFormsModule,
		routing,
		ColorPickerModule,
// 		BsDropdownModule.forRoot(), // dep for DatetimePopup
// 		DatepickerModule.forRoot(), // ditto
// 		TimepickerModule.forRoot(), // ditto
		TooltipModule.forRoot(),
		ModalModule.forRoot(),
		PopoverModule.forRoot(),
		BrowserAnimationsModule,
		AngularFittextModule,
		IconPickerModule,
		// HomeModule,
		SharedModule,
		// AboutModule,
		// CampusLifeModule,
		// DailyBulletinModule,
		// LunchModule,
		// PlannerModule,
		// SettingsModule,
		AuthenticationModule,
		// UnsubscribeModule,
		// ResetPasswordModule,
		// ConfirmModule,
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
		BackgroundService
		// RealtimeService,
	],
	bootstrap: [AppComponent],

})
export class AppModule {
	constructor(library: FaIconLibrary) {
		// Add an icon to the library for convenient access in other components
		library.addIconPacks(fas, far, fab);
	}
}
