import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { typeOf } from '../../common/utils';

import { AlertService } from '../../services/alert.service';

@Component({
	selector: 'mymicds-unsubscribe',
	templateUrl: './unsubscribe.component.html',
	styleUrls: ['./unsubscribe.component.scss']
})
export class UnsubscribeComponent implements OnInit {

	// We need to include this to use in HTML
	typeOf = typeOf;
	unsubscribeResponse: boolean = null;

	constructor(private router: Router, private route: ActivatedRoute, private alertService: AlertService) { }

	ngOnInit() {
		this.route.params.subscribe(
			params => {
				const user = params.user;
				const hash = params.hash;
				console.log(user, hash);
				Observable.of(null).delay(1000).subscribe(
					() => {
						this.unsubscribeResponse = true;
					},
					error => {
						this.unsubscribeResponse = false;
					}
				);
			},
			error => {
				this.unsubscribeResponse = false;
			}
		);
	}

}
