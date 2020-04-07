import { MyMICDS } from '@mymicds/sdk';
import { MyMICDSFactory } from './common/mymicds-sdk';

import { NgModule } from '@angular/core';
import { BrowserModule, Title } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { appRoutingProviders, routing } from './app.routing';
import { ColorPickerModule, ColorPickerService } from 'ngx-color-picker';
import {
	BsDropdownModule,
	DatepickerModule,
	ModalModule,
	PopoverModule,
	TimepickerModule,
	TooltipModule
} from 'ngx-bootstrap';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { DatetimePopupModule } from 'ngx-bootstrap-datetime-popup';
import { GridsterModule } from 'angular2gridster';
import { AngularFittextModule } from 'angular-fittext';
import { IconPickerModule } from 'ngx-icon-picker';
import { PdfViewerModule } from 'ng2-pdf-viewer';

import { AppComponent } from './app.component';
import { AboutComponent } from './components/about/about.component';
import { AlertComponent } from './components/alert/alert.component';
import { AlertDebugComponent } from './components/alert-debug/alert-debug.component';
import { BulletinArchivesComponent } from './components/bulletin-archives/bulletin-archives.component';
import { HomeComponent } from './components/home/home.component';
import { CampusComponent } from './components/campus/campus.component';

import { ModuleOptionsComponent } from './components/module-options/module-options.component';
import { ModuleContainerComponent } from './components/module-container/module-container.component';
import { ModuleOptionComponent } from './components/module-options/module-option/module-option.component';

import { moduleComponents } from './components/modules/module-config';

import { BookmarksComponent } from './components/modules/bookmarks/bookmarks.component';
import { CountdownComponent } from './components/modules/countdown/countdown.component';
import { GpaCalculatorComponent } from './components/modules/gpa-calculator/gpa-calculator.component';
import { ProgressComponent } from './components/modules/progress/progress.component';
import { ScheduleComponent } from './components/modules/schedule/schedule.component';
import { SimplifiedScheduleComponent } from './components/modules/simplified-schedule/simplified-schedule.component';
import { SnowdayComponent } from './components/modules/snowday/snowday.component';
import { StickynotesComponent } from './components/modules/stickynotes/stickynotes.component';
import { SimplifiedLunchComponent } from './components/modules/simplified-lunch/simplified-lunch.component';
import { TwitterComponent } from './components/modules/twitter/twitter.component';
import { WeatherComponent } from './components/modules/weather/weather.component';

import { ConfettiComponent } from './components/confetti/confetti.component';
import { ConfirmComponent } from './components/confirm/confirm.component';
import { DailyBulletinComponent } from './components/daily-bulletin/daily-bulletin.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { HelpComponent } from './components/help/help.component';
import { LoginComponent } from './components/login/login.component';
import { LogoutComponent } from './components/logout/logout.component';
import { LunchComponent } from './components/lunch/lunch.component';
import { ModuleInspectorComponent } from './components/module-inspector/module-inspector.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { PlannerComponent } from './components/planner/planner.component';
import { RegisterComponent } from './components/register/register.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';

import { SettingsComponent } from './components/settings/settings.component';
import { AliasesComponent } from './components/settings/aliases/aliases.component';
import { BackgroundComponent } from './components/settings/background/background.component';
import { ChangePasswordComponent } from './components/settings/change-password/change-password.component';
import { ClassesComponent } from './components/settings/classes/classes.component';
import { InfoComponent } from './components/settings/info/info.component';
import { UnsubscribeComponent } from './components/unsubscribe/unsubscribe.component';
import { UrlComponent } from './components/settings/url/url.component';

import { SportsComponent } from './components/sports/sports.component';
import { SuggestionsComponent } from './components/suggestions/suggestions.component';
import { SummerComponent } from './components/summer/summer.component';
import { QuotesComponent } from './components/quotes/quotes.component';

import { BlurDirective, DarkBlurDirective, WhiteBlurDirective } from './directives/blur.directive';

import { AlertService } from './services/alert.service';
import { BackgroundService } from './services/background.service';
import { CapitalizePipe } from './pipes/capitalize.pipe';
import { CompassDirectionPipe } from './pipes/compass-direction.pipe';
import { DayRotationPipe } from './pipes/day-rotation.pipe';
import { GradePipePipe } from './pipes/grade-pipe.pipe';
import { RoundPipe } from './pipes/round.pipe';
import { SafeHtmlPipe, SafeResourceUrlPipe, SafeScriptPipe, SafeStylePipe, SafeUrlPipe } from './pipes/safe.pipe';
import { SchoolPercentagePipe } from './pipes/school-percentage.pipe';
import { ValuesPipe } from './pipes/values.pipe';
import { WeatherIconPipe } from './pipes/weather-icon.pipe';
import { SlideshowModule } from 'ng-simple-slideshow';
import { MomentDatePipe } from './pipes/moment-date.pipe';
// import { RealtimeService } from './services/realtime.service';
// RxJS 6 Zone.js Fix
// import 'zone.js/dist/zone-patch-rxjs';

// Font Awesome
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import { fab, faTwitter } from '@fortawesome/free-brands-svg-icons';

@NgModule({
	declarations: [
		// Components
		AppComponent,
		AboutComponent,
		AlertComponent,
		AlertDebugComponent,
		HomeComponent,
		ModuleOptionsComponent,
		ModuleOptionComponent,
		ModuleContainerComponent,
		BookmarksComponent,
		CampusComponent,
		CountdownComponent,
		GpaCalculatorComponent,
		ProgressComponent,
		ScheduleComponent,
		SimplifiedLunchComponent,
		SimplifiedScheduleComponent,
		SnowdayComponent,
		StickynotesComponent,
		TwitterComponent,
		WeatherComponent,
		BulletinArchivesComponent,
		ConfettiComponent,
		ConfirmComponent,
		DailyBulletinComponent,
		ForgotPasswordComponent,
		HelpComponent,
		LoginComponent,
		LogoutComponent,
		LunchComponent,
		ModuleInspectorComponent,
		NavbarComponent,
		PlannerComponent,
		RegisterComponent,
		ResetPasswordComponent,
		SettingsComponent,
		AliasesComponent,
		BackgroundComponent,
		ChangePasswordComponent,
		ClassesComponent,
		InfoComponent,
		UrlComponent,
		UnsubscribeComponent,
		SportsComponent,
		SuggestionsComponent,
		SummerComponent,
		QuotesComponent,

		// Directives
		BlurDirective,
		DarkBlurDirective,
		WhiteBlurDirective,

		// Pipes
		CapitalizePipe,
		CompassDirectionPipe,
		DayRotationPipe,
		GradePipePipe,
		MomentDatePipe,
		RoundPipe,
		SafeHtmlPipe,
		SafeScriptPipe,
		SafeStylePipe,
		SafeUrlPipe,
		SafeResourceUrlPipe,
		SchoolPercentagePipe,
		ValuesPipe,
		WeatherIconPipe
	],
	imports: [
		BrowserModule,
		FormsModule,
		ReactiveFormsModule,
		routing,
		ColorPickerModule,
		BsDatepickerModule.forRoot(),
		BsDropdownModule.forRoot(), // dep for DatetimePopup
		DatepickerModule.forRoot(), // ditto
		TimepickerModule.forRoot(), // ditto
		DatetimePopupModule.forRoot(),
		ModalModule.forRoot(),
		PopoverModule.forRoot(),
		TooltipModule.forRoot(),
		GridsterModule.forRoot(),
		BrowserAnimationsModule,
		AngularFittextModule,
		IconPickerModule,
		PdfViewerModule,
		SlideshowModule,
		FontAwesomeModule
	],
	providers: [
		{
			provide: MyMICDS,
			useFactory: MyMICDSFactory
		},
		appRoutingProviders,
		ColorPickerService,
		Title,
		AlertService,
		BackgroundService
		// RealtimeService,
	],
	bootstrap: [AppComponent],
	entryComponents: moduleComponents
})
export class AppModule {
	constructor(library: FaIconLibrary) {
		// Add an icon to the library for convenient access in other components
		library.addIconPacks(fas, far, fab);
		library.addIcons(faTwitter);
	}
}
