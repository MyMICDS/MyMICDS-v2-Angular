import * as config from './common/config';

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
	constructor(private viewContainerRef: ViewContainerRef, private alertService: AlertService, private backgroundService: BackgroundService) {
		// Get custom user background
		this.backgroundService.get().subscribe(
			data => {
				this.backgrounds = data.variants;
			},
			error => {
				this.alertService.addAlert('danger', 'Get Background Error!', error);
			}
		);
	}

	backgrounds:any = {
		normal: config.backendURL + '/user-backgrounds/default/normal.jpg',
		blur: config.backendURL + '/user-backgrounds/default/blur.jpg'
	};

	ngOnInit() {
		setTimeout(() => {
			this.alertService.addAlert('info', 'Help!', 'Hey you. Yeah you. <a class="alert-link" href="https://goo.gl/forms/442vRtzMxuZHQbWK2" target="_blank">Can you give us some feedback on MyMICDS 2.0?</a>');
		}, 1000);
	}
}
