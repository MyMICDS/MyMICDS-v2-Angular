import * as config from './common/config';

import {Component, ViewContainerRef} from '@angular/core';
import {LocalStorage, SessionStorage} from 'h5webstorage';

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
	providers: [LocalStorage, SessionStorage, AlertService, AuthService, BackgroundService, CanvasService, PortalService, UserService],
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
}
