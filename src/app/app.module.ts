import { NgModule } from '@angular/core';
import { BrowserModule, Title } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule, Http } from '@angular/http';
import { routing, appRoutingProviders } from './app.routing';
import { ColorPickerModule, ColorPickerService } from 'ngx-color-picker';
import { DatepickerModule, ModalModule, PopoverModule, TooltipModule } from 'ngx-bootstrap';
import { DatetimePopupModule } from 'ngx-bootstrap-datetime-popup';
import { GridsterModule } from 'angular2gridster';
import { AuthHttp, AuthConfig, JwtHelper } from 'angular2-jwt';
const jwtHelper = new JwtHelper();

import { AppComponent } from './app.component';
import { AboutComponent } from './components/about/about.component';
import { AlertComponent } from './components/alert/alert.component';
import { BulletinArchivesComponent } from './components/bulletin-archives/bulletin-archives.component';
import { HomeComponent } from './components/home/home.component';

import { ModuleOptionsComponent } from './components/module-options/module-options.component';
import { ModuleContainerComponent } from './components/module-container/module-container.component';
import { ModuleOptionComponent } from './components/module-options/module-option/module-option.component';

import { moduleComponents } from './components/modules/module-config';

import { CountdownComponent } from './components/modules/countdown/countdown.component';
import { ProgressComponent } from './components/modules/progress/progress.component';
import { ScheduleComponent } from './components/modules/schedule/schedule.component';
import { SimplifiedScheduleComponent } from './components/modules/simplified-schedule/simplified-schedule.component';
import { SnowdayComponent } from './components/modules/snowday/snowday.component';
import { WeatherComponent } from './components/modules/weather/weather.component';
import { StickynotesComponent } from './components/modules/stickynotes/stickynotes.component';
import { SimplifiedLunchComponent } from './components/modules/simplified-lunch/simplified-lunch.component';

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
import { UrlComponent } from './components/settings/url/url.component';

import { SportsComponent } from './components/sports/sports.component';
import { SuggestionsComponent } from './components/suggestions/suggestions.component';
import { QuotesComponent } from './components/quotes/quotes.component';

import { BlurDirective, DarkBlurDirective, WhiteBlurDirective } from './directives/blur.directive';

import { AlertService } from './services/alert.service';
import { AliasService } from './services/alias.service';
import { AuthService } from './services/auth.service';
import { BackgroundService } from './services/background.service';
import { BulletinService } from './services/bulletin.service';
import { CanvasService } from './services/canvas.service';
import { ClassesService } from './services/classes.service';
import { DatesService } from './services/dates.service';
import { FeedsService } from './services/feeds.service';
import { RealtimeService } from './services/realtime.service';
import { LunchService } from './services/lunch.service';
import { ModulesService } from './services/modules.service';
import { PlannerService } from './services/planner.service';
import { PortalService } from './services/portal.service';
import { ScheduleService } from './services/schedule.service';
import { SnowdayService } from './services/snowday.service';
import { SportsService } from './services/sports.service';
import { StatsService } from './services/stats.service';
import { UserService } from './services/user.service';
import { WeatherService } from './services/weather.service';
import { NotificationService } from './services/notification.service';
import { SuggestionsService } from './services/suggestions.service';
import { QuoteService } from './services/quote.service';
import { StickynotesService } from './services/stickynotes.service';

import { CapitalizePipe } from './pipes/capitalize.pipe';
import { CompassDirectionPipe } from './pipes/compass-direction.pipe';
import { DayRotationPipe } from './pipes/day-rotation.pipe';
import { RoundPipe } from './pipes/round.pipe';
import { SafeHtmlPipe, SafeScriptPipe, SafeStylePipe, SafeUrlPipe, SafeResourceUrlPipe } from './pipes/safe.pipe';
import { SchoolPercentagePipe } from './pipes/school-percentage.pipe';
import { ValuesPipe } from './pipes/values.pipe';
import { WeatherIconPipe } from './pipes/weather-icon.pipe';

@NgModule({
	declarations: [
		// Components
		AppComponent,
		AboutComponent,
		AlertComponent,
		HomeComponent,
		ModuleOptionsComponent,
		ModuleOptionComponent,
		ModuleContainerComponent,
		CountdownComponent,
		ProgressComponent,
		ScheduleComponent,
		SimplifiedLunchComponent,
		SimplifiedScheduleComponent,
		SnowdayComponent,
		StickynotesComponent,
		WeatherComponent,
		BulletinArchivesComponent,
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
		SportsComponent,
		SuggestionsComponent,
		QuotesComponent,

		// Directives
		BlurDirective,
		DarkBlurDirective,
		WhiteBlurDirective,

		// Pipes
		CapitalizePipe,
		CompassDirectionPipe,
		DayRotationPipe,
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
		HttpModule,
		routing,
		ColorPickerModule,
		DatepickerModule.forRoot(),
		ModalModule.forRoot(),
		PopoverModule.forRoot(),
		TooltipModule.forRoot(),
		DatetimePopupModule.forRoot(),
		GridsterModule,
		BrowserAnimationsModule
	],
	providers: [
		appRoutingProviders,
		ColorPickerService,
		Title,
		AlertService,
		AliasService,
		AuthService,
		BackgroundService,
		BulletinService,
		CanvasService,
		ClassesService,
		DatesService,
		FeedsService,
		RealtimeService,
		LunchService,
		ModulesService,
		PlannerService,
		PortalService,
		ScheduleService,
		SnowdayService,
		SportsService,
		StatsService,
		UserService,
		WeatherService,
		NotificationService,
		SuggestionsService,
		QuoteService,
		StickynotesService,

		// JWT
		{
			provide: AuthHttp,
			useFactory: authHttpServiceFactory,
			deps: [Http]
		}
	],
	bootstrap: [AppComponent],
	entryComponents: moduleComponents
})
export class AppModule { }

export function authHttpServiceFactory(http) {
	return new AuthHttp(new AuthConfig({
		tokenGetter: () => {
			// Look in session storage for id_token, but fallback to local storage
			let session = sessionStorage.getItem('id_token');
			let local = localStorage.getItem('id_token');

			let token = session || local;

			if (typeof token !== 'string') { return ''; }

			// Remove any quotations from the sides
			token = token.split('"').join('');

			// Check validity of jwt token
			if (token.split('.').length !== 3) {
				localStorage.removeItem('id_token');
				sessionStorage.removeItem('id_token');
				return '';
			}

			// Check if token is expired. If it is, delete and send user to login page
			if (jwtHelper.isTokenExpired(token)) {
				sessionStorage.removeItem('id_token');
				localStorage.removeItem('id_token');

				this.router.navigate(['/login']);
				return '';
			}

			return token;
		},
		noJwtError: true
	}), http);
}
