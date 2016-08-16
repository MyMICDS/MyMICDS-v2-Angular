import {Component, ViewContainerRef} from '@angular/core';
import {HTTP_PROVIDERS} from '@angular/http';
import {ROUTER_DIRECTIVES} from '@angular/router';
import {LocalStorage, SessionStorage} from 'h5webstorage';

import {NavbarComponent} from './components/Navbar/navbar.component';
import {AlertComponent} from './components/Alert/alert.component';
import {HomeComponent} from './components/Home/home.component';
import {LunchComponent} from './components/Lunch/lunch.component';
import {PlannerComponent} from './components/Planner/planner.component';
import {DailyBulletinComponent} from './components/DailyBulletin/daily-bulletin.component';
import {BulletinArchivesComponent} from './components/BulletinArchives/bulletin-archives.component';
import {SettingsComponent} from './components/Settings/settings.component';
import {AboutComponent} from './components/About/about.component';
import {HelpComponent} from './components/Help/help.component';
import {LoginComponent} from './components/Login/login.component';
import {LogoutComponent} from './components/Logout/logout.component';
import {RegisterComponent} from './components/Register/register.component';
import {ConfirmComponent} from './components/Confirm/confirm.component';
import {ForgotPasswordComponent} from './components/ForgotPassword/forgot-password.component';
import {ResetPasswordComponent} from './components/ResetPassword/reset-password.component';

import {AlertService} from './services/alert.service';
import {AuthService} from './services/auth.service';
import {BackgroundService} from './services/background.service';
import {CanvasService} from './services/canvas.service';
import {PortalService} from './services/portal.service';
import {UserService} from './services/user.service';


@Component({
	selector: 'mymicds-app',
	template: `
		<navbar></navbar>
		<alert></alert>
		<router-outlet></router-outlet>
	`,
	styles: [':host { height: 100%; }'],
	providers: [HTTP_PROVIDERS, LocalStorage, SessionStorage, AlertService, AuthService, BackgroundService, CanvasService, PortalService, UserService],
	directives: [NavbarComponent, ROUTER_DIRECTIVES, AlertComponent],
	precompile: [
				NavbarComponent,         HomeComponent,          LunchComponent,
				PlannerComponent,        DailyBulletinComponent, BulletinArchivesComponent,
				SettingsComponent,       AboutComponent,         HelpComponent,
				LoginComponent,          LogoutComponent,        RegisterComponent,
				ConfirmComponent,        ForgotPasswordComponent, ResetPasswordComponent
			]
})
export class AppComponent {

	/*
	 * We must import the ViewContainerRef in order to get the ng2-bootstrap modals to work.
	 * You need this small hack in order to catch application root view container ref.
	 */
	constructor(private viewContainerRef: ViewContainerRef, private alertService: AlertService) {}

	ngOnInit() {
		setTimeout(() => {
			this.alertService.addAlert('info', 'Welcome Back!', 'Over the summer, the MyMICDS Development Team has been hard at work rewriting the website to hopefully add more features in the futre. <strong>This year everyone must re-register an account into our new system.</strong> Don\'t forget to email support@mymicds.net for any new features you would like to see in the new MyMICDS 2.0! (Also please note there are a few bug throughout the site, so email support also if you encounter any problems. Refreshing sometimes fixes the problem.)');
		}, 1000);
	}

}
