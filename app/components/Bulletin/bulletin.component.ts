import {Component} from '@angular/core';
import {BulletinService} from '../../services/bulletin.service'

@Component({
	selector: 'bulletin',
	template:  `<div class="alert alert-danger">{{bulletinErr}}</div>
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
				if (bulletin.length == 0) {
					this.bulletinErr = 'Sorry, daily bulletin is not avaliable at this point.'
				} else {
					this.bulletinList = bulletin;
				}
			},
			error => {
				this.bulletinErr = error;
			}
		)
	}
}
