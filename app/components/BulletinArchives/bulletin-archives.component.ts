import {Component} from '@angular/core';

import {BulletinService} from '../../services/bulletin.service';

@Component({
	selector: 'bulletin-archives',
	templateUrl: 'app/components/BulletinArchives/bulletin-archives.html',
	styleUrls: ['dist/app/components/BulletinArchives/bulletin-archives.css'],
	providers: [BulletinService]
})
export class BulletinArchivesComponent {
	constructor(private bulletinService: BulletinService) {}

	bulletins:string[];

	ngOnInit() {
		this.bulletinService.listBulletins().subscribe(
			bulletins => {
				this.bulletins = bulletins;
			},
			error => {
				console.log('Bulletin error', error);
			}
		)
	}
}
