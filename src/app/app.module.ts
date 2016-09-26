import { BrowserModule, Title } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule, Http } from '@angular/http';
import { routing, appRoutingProviders } from './app.routing';
import { ColorPickerModule, ColorPickerService } from 'angular2-color-picker';
import { DatepickerModule, ModalModule } from 'ng2-bootstrap/ng2-bootstrap';
import {AuthHttp, AuthConfig, JwtHelper, AUTH_PROVIDERS} from 'angular2-jwt';
let jwtHelper = new JwtHelper();

import { AppComponent } from './app.component';
import { AboutComponent } from './components/about/about.component';
import { AlertComponent } from './components/alert/alert.component';
import { BulletinArchivesComponent } from './components/bulletin-archives/bulletin-archives.component';
import { HomeComponent } from './components/home/home.component';
import { ProgressComponent } from './components/home/progress/progress.component';
import { ScheduleComponent } from './components/home/schedule/schedule.component';
import { WeatherComponent } from './components/home/weather/weather.component';

import { ConfirmComponent } from './components/confirm/confirm.component';
import { DailyBulletinComponent } from './components/daily-bulletin/daily-bulletin.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { HelpComponent } from './components/help/help.component';
import { LoginComponent } from './components/login/login.component';
import { LogoutComponent } from './components/logout/logout.component';
import { LunchComponent } from './components/lunch/lunch.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { PlannerComponent } from './components/planner/planner.component';
import { RegisterComponent } from './components/register/register.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { SettingsComponent } from './components/settings/settings.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';

import { BlurDirective, DarkBlurDirective, WhiteBlurDirective } from './directives/blur.directive';

import { AlertService } from './services/alert.service';
import { AliasService } from './services/alias.service';
import { AuthService } from './services/auth.service';
import { BackgroundService } from './services/background.service';
import { BulletinService } from './services/bulletin.service';
import { CanvasService } from './services/canvas.service';
import { ClassesService } from './services/classes.service';
import { LunchService } from './services/lunch.service';
import { PlannerService } from './services/planner.service';
import { PortalService } from './services/portal.service';
import { SocketioService } from './services/socketio.service';
import { UserService } from './services/user.service';
import { WeatherService } from './services/weather.service';

import { CompassDirectionPipe } from './pipes/compass-direction.pipe';
import { DayRotationPipe } from './pipes/day-rotation.pipe';
import { RoundPipe } from './pipes/round.pipe';
import { SafeHtmlPipe, SafeScriptPipe, SafeStylePipe, SafeUrlPipe, SafeResourceUrlPipe } from './pipes/safe.pipe';
import { SchoolPercentagePipe } from './pipes/school-percentage.pipe';
import { ValuesPipe } from './pipes/values.pipe';
import { WeatherIconPipe } from './pipes/weather-icon.pipe';
import { SportsComponent } from './components/sports/sports.component';

@NgModule({
	declarations: [
		// Components
		AppComponent,
		HomeComponent,
		AboutComponent,
		AlertComponent,
		ProgressComponent,
		ScheduleComponent,
		WeatherComponent,
		BulletinArchivesComponent,
		ConfirmComponent,
		DailyBulletinComponent,
		ForgotPasswordComponent,
		HelpComponent,
		LoginComponent,
		LogoutComponent,
		LunchComponent,
		NavbarComponent,
		PlannerComponent,
		RegisterComponent,
		ResetPasswordComponent,
		SettingsComponent,
		SidebarComponent,

		// Directives
		BlurDirective,
		DarkBlurDirective,
		WhiteBlurDirective,

		// Pipes
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
		WeatherIconPipe, SportsComponent
	],
	imports: [
		BrowserModule,
		FormsModule,
		ReactiveFormsModule,
		HttpModule,
		routing,
		ColorPickerModule,
		DatepickerModule,
		ModalModule
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
		LunchService,
		PlannerService,
		PortalService,
		SocketioService,
		UserService,
		WeatherService,

		// JWT
		AUTH_PROVIDERS,
		{
			provide: AuthHttp,
			useFactory: (http) => {
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
			},
			deps: [Http]
		}
	],
	bootstrap: [AppComponent]
})
export class AppModule { }
