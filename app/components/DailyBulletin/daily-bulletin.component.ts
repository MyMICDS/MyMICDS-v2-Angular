import * as config from '../../common/config';

import {Component} from '@angular/core';
import {ROUTER_DIRECTIVES, ActivatedRoute} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import '../../common/rxjs-operators';
import {contains} from '../../common/utils';

import {BlurDirective} from '../../directives/blur.directive';

import {AlertService} from '../../services/alert.service';
import {BulletinService} from '../../services/bulletin.service';

import {SafeResourceUrlPipe} from '../../pipes/safe.pipe';

@Component({
	selector: 'daily-bulletin',
	templateUrl: 'app/components/DailyBulletin/daily-bulletin.html',
	styleUrls: ['dist/app/components/DailyBulletin/daily-bulletin.css'],
	directives: [ROUTER_DIRECTIVES, BlurDirective],
	pipes: [SafeResourceUrlPipe],
	providers: [BulletinService]
})
export class DailyBulletinComponent {
	constructor(private route: ActivatedRoute, private alertService: AlertService, private bulletinService: BulletinService) {}

	loading = true;

	bulletins:string[];
	bulletinURL:string = '';
	bulletinDate:any = new Date();

	ngOnInit() {
		var source = Observable.combineLatest([
			this.bulletinService.listBulletins(),
			this.route.params
		]);

		source.subscribe(
			(data:any) => {
				this.loading = false;
				console.log(data)

				this.bulletins = data[0].bulletins;

				// Check if a specific bulletin was supplied in the url. By default use most recent bulletin.
				let bulletinParam = data[1]['bulletin'];
				if(typeof bulletinParam !== 'undefined' && contains(this.bulletins, bulletinParam)) {
					// Bulletin parameter is valid! Use that instead.
					this.bulletinURL = data[0].baseURL + '/' + bulletinParam + '.pdf';
					this.bulletinDate = new Date(bulletinParam);
				} else {
					// Use most recent bulletin
					this.bulletinURL = data[0].baseURL + '/' + this.bulletins[0] + '.pdf';
					this.bulletinDate = new Date(this.bulletins[0]);
				}

			},
			error => {
				this.alertService.addAlert('danger', 'Get Bulletins Error!', error);
			}
		)
	}
}
