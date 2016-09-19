import { Component, OnInit } from '@angular/core';

import { AlertService } from '../../services/alert.service';
import { BulletinService } from '../../services/bulletin.service';

@Component({
	selector: 'mymicds-bulletin-archives',
	templateUrl: './bulletin-archives.component.html',
	styleUrls: ['./bulletin-archives.component.scss']
})
export class BulletinArchivesComponent implements OnInit {

	bulletins: string[];
	baseURL: string;

	constructor(private alertService: AlertService, private bulletinService: BulletinService) { }

	ngOnInit() {
		this.bulletinService.listBulletins().subscribe(
			data => {
				this.bulletins = data.bulletins;
				this.baseURL = data.baseURL;
			},
			error => {
				this.alertService.addAlert('danger', 'Get Bulletins Error!', error);
			}
		);
	}

}
