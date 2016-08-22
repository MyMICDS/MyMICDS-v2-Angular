import * as config from '../../common/config';

import {Component} from '@angular/core';
import {ROUTER_DIRECTIVES, ActivatedRoute} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import '../../common/rxjs-operators';
import moment from 'moment';
import {FaComponent} from 'angular2-fontawesome/components';
import {contains} from '../../common/utils';

import {BlurDirective} from '../../directives/blur.directive';

import {AlertService} from '../../services/alert.service';
import {BulletinService} from '../../services/bulletin.service';

import {SafeResourceUrlPipe} from '../../pipes/safe.pipe';

@Component({
	selector: 'daily-bulletin',
	templateUrl: 'app/components/DailyBulletin/daily-bulletin.html',
	styleUrls: ['dist/app/components/DailyBulletin/daily-bulletin.css'],
	directives: [ROUTER_DIRECTIVES, FaComponent, BlurDirective],
	pipes: [SafeResourceUrlPipe],
	providers: [BulletinService]
})
export class DailyBulletinComponent {
	constructor(private route: ActivatedRoute, private alertService: AlertService, private bulletinService: BulletinService) {}

	loading = true;

	bulletins:string[] = [];
	bulletinBaseURL:string = '';
	bulletinURL:string = '';
	bulletinDate:any = moment();
	bulletinIndex:number = 0;

	ngOnInit() {
		var source = Observable.combineLatest([
			this.bulletinService.listBulletins(),
			this.route.params
		]);

		source.subscribe(
			(data:any) => {
				this.loading = false;
				console.log(data)

				this.bulletinBaseURL = data[0].baseURL;
				this.bulletins = data[0].bulletins;

				// Check if a specific bulletin was supplied in the url. By default use most recent bulletin.
				let bulletinParam = data[1]['bulletin'];
				if(typeof bulletinParam !== 'undefined' && contains(this.bulletins, bulletinParam)) {
					// Bulletin parameter is valid! Use that instead.
					this.bulletinIndex = this.bulletins.indexOf(bulletinParam);
				}

				this.setBulletin(this.bulletinIndex);

			},
			error => {
				this.alertService.addAlert('danger', 'Get Bulletins Error!', error);
			}
		)
	}

	setBulletin(index) {
		this.bulletinURL = this.bulletinBaseURL + '/' + this.bulletins[index] + '.pdf';
		this.bulletinDate = moment(this.bulletins[index]);
	}

	previousBulletin() {
		if(this.bulletinIndex < this.bulletins.length - 1) {
			this.bulletinIndex++;
			this.setBulletin(this.bulletinIndex);
		}
	}

	currentBulletin() {
		this.bulletinIndex = 0;
		this.setBulletin(this.bulletinIndex);
	}

	nextBulletin() {
		if(this.bulletinIndex > 0) {
			this.bulletinIndex--;
			this.setBulletin(this.bulletinIndex);
		}
	}

}
