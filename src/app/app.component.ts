import {environment} from '../environments/environment';

import {Component, ViewContainerRef} from '@angular/core';

import {AlertService} from './services/alert.service';
import {AuthService} from './services/auth.service';
import {BackgroundService} from './services/background.service';
import {CanvasService} from './services/canvas.service';
import {PortalService} from './services/portal.service';
import {UserService} from './services/user.service';


@Component({
	selector: 'mymicds-app',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
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
		normal: environment.backendURL + '/user-backgrounds/default/normal.jpg',
		blur: environment.backendURL + '/user-backgrounds/default/blur.jpg'
	};
}

