import {Component} from '@angular/core';
import {NgFor, NgIf} from '@angular/common';
import {ROUTER_DIRECTIVES} from '@angular/router';

import {BulletinService} from '../../services/bulletin.service';

@Component({
	selector: 'bulletin-archives',
	templateUrl: 'app/components/BulletinArchives/bulletin-archives.html',
	styleUrls: ['dist/app/components/BulletinArchives/bulletin-archives.css'],
	directives: [NgFor, NgIf, ROUTER_DIRECTIVES],
	providers: [BulletinService]
})
export class BulletinArchivesComponent {
	constructor(private bulletinService: BulletinService) {}

	bulletins:string[];
	baseURL:string;

	ngOnInit() {
		this.bulletinService.listBulletins().subscribe(
			data => {
				this.bulletins = data.bulletins;
				this.baseURL = data.baseURL;
			},
			error => {
				console.log('Bulletin error', error);
			}
		)
	}
}
