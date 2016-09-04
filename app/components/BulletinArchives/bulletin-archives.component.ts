import {Component} from '@angular/core';

import {BlurDirective} from '../../directives/blur.directive';

import {AlertService} from '../../services/alert.service';
import {BulletinService} from '../../services/bulletin.service';

@Component({
	selector: 'bulletin-archives',
	templateUrl: 'app/components/BulletinArchives/bulletin-archives.html',
	styleUrls: ['dist/app/components/BulletinArchives/bulletin-archives.css'],
	providers: [BulletinService]
})
export class BulletinArchivesComponent {
	constructor(private alertService: AlertService, private bulletinService: BulletinService) {}

	bulletins:string[];
	baseURL:string;

	ngOnInit() {
		this.bulletinService.listBulletins().subscribe(
			data => {
				this.bulletins = data.bulletins;
				this.baseURL = data.baseURL;
			},
			error => {
				this.alertService.addAlert('danger', 'Get Bulletins Error!', error);
			}
		)
	}
}
