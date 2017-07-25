import { Component, OnInit, OnDestroy } from '@angular/core';

import { AuthService } from '../../services/auth.service';

@Component({
	selector: 'mymicds-settings',
	templateUrl: './settings.component.html',
	styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit, OnDestroy {

	username: string = null;
	authSubscription: any;

	constructor(private authService: AuthService) { }

	ngOnInit() {
		this.authSubscription = this.authService.auth$.subscribe(
			data => {
				this.username = data.user;
			}
		);
	}

	ngOnDestroy() {

	}

}
