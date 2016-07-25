import {Component} from '@angular/core';
import {BulletinService} from '../../services/bulletin.service'

@Component({
	selector: 'bulletin',
	template:  `<div>{{bulletinErr}}</div>
				<div>{{bulletinList}}</div>`,
	providers: [BulletinService]
})
export class BulletinComponent {
	constructor(private bulletinService: BulletinService) {}

	bulletinList: any[];
	bulletinErr: string;

	ngOnInit() {
		this.bulletinService.getBulletin().subscribe(
			bulletin => {
				this.bulletinList = bulletin;
			},
			error => {
				this.bulletinErr = error;
			}
		)
	}
}
