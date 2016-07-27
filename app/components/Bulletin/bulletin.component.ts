import * as config from '../../common/config';

import {Component} from '@angular/core';
import {ROUTER_DIRECTIVES, ActivatedRoute} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import '../../common/rxjs-operators';

import {BulletinService} from '../../services/bulletin.service';

import {SafePipe} from '../../pipes/safe.pipe';

@Component({
	selector: 'daily-bulletin',
	templateUrl: 'app/components/Bulletin/bulletin.html',
	styleUrls: ['dist/app/components/Bulletin/bulletin.css'],
	directives: [ROUTER_DIRECTIVES],
	pipes: [SafePipe],
	providers: [BulletinService]
})
export class BulletinComponent {
	constructor(private route: ActivatedRoute, private bulletinService: BulletinService) {}

	bulletins:string[];
	bulletinPDFURL:string;
	bulletinURL:string;
	bulletinDate:any = new Date();

	ngOnInit() {
		var source = Observable.combineLatest(
			this.bulletinService.listBulletins(),
			this.route.params,
			function(s1, s2) { return [s1, s2] }
		);

		source.subscribe(
			data => {

				this.bulletins = data[0].bulletins;

				// Check if a specific bulletin was supplied in the url. By default use most recent bulletin.
				let bulletinParam = data[1]['bulletin'];

				if(bulletinParam !== 'undefined' && this.bulletins.indexOf(bulletinParam) > -1) {
					// Bulletin parameter is valid! Use that instead.
					this.bulletinPDFURL = data[0].baseURL + '/' + bulletinParam + '.pdf';
				} else {
					// Use most recent bulletin
					this.bulletinPDFURL = data[0].baseURL + '/' + this.bulletins[0] + '.pdf';
				}

				/*
				 * WARNING: The Google Docs PDF Viewer does not work if the URL is http.
				 * Fallback to regular URL if the current backendURL does not have https.
				 */
				if(config.backendURL.startsWith('https://')) {
					this.bulletinURL = 'https://docs.google.com/gview?url=' + this.bulletinPDFURL + '&embedded=true';
				} else {
					this.bulletinURL = this.bulletinPDFURL;
				}

				this.bulletinDate = new Date(this.bulletins[0]);
			},
			error => {
				console.log('Bulletin error', error);
			}
		)
	}
}
