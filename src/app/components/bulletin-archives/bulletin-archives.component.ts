import { Component, OnInit } from '@angular/core';
import moment from 'moment';

import { AlertService } from '../../services/alert.service';
import { BulletinService } from '../../services/bulletin.service';

@Component({
	selector: 'mymicds-bulletin-archives',
	templateUrl: './bulletin-archives.component.html',
	styleUrls: ['./bulletin-archives.component.scss']
})
export class BulletinArchivesComponent implements OnInit {

	bulletins: string[];
	bulletinDateDisplays: string[] = [];
	baseURL: string;

	constructor(private alertService: AlertService, private bulletinService: BulletinService) { }

	ngOnInit() {
		this.bulletinService.listBulletins().subscribe(
			data => {
				this.bulletins = data.bulletins;
				this.baseURL = data.baseURL;

				// Loop through all the bulletins to get the display date
				for (let i = 0; i < this.bulletins.length; i++) {
					let date = moment(this.bulletins[i]);
					this.bulletinDateDisplays[i] = date.format('dddd, MMMM Do, YYYY');
				}
			},
			error => {
				this.alertService.addAlert('danger', 'Get Bulletins Error!', error);
			}
		);
	}

}
