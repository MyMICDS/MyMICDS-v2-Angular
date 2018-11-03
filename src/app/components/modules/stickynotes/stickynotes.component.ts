import { MyMICDS } from '@mymicds/sdk';

import { Component, OnInit, Input } from '@angular/core';
import { Subject } from 'rxjs/Rx';

import { SubscriptionsComponent } from '../../../common/subscriptions-component';
import { AlertService } from '../../../services/alert.service';

export enum COLOR {
	WHITE = 'WHITE',
	GRAY = 'GRAY',
	TEAL = 'TEAL',
	YELLOW = 'YELLOW',
	PINK = 'PINK',
	ORANGE = 'ORANGE'
}

@Component({
	selector: 'mymicds-stickynote',
	templateUrl: './stickynotes.component.html',
	styleUrls: ['./stickynotes.component.scss']
})
export class StickynotesComponent extends SubscriptionsComponent implements OnInit {

	private _moduleId: string;
	@Input() set moduleId(id) {
		if (this._moduleId !== id) {
			this._moduleId = id;
			this.addSubscription(
				this.mymicds.stickyNotes.get({ moduleId: id }).subscribe(
					data => {
						this.text = data.stickynote.text;
					},
					error => {
						this.alertService.addAlert('danger', 'Get Sticky Note Error!', 'Please save the module layout first.');
					}
				)
			);
		}
	};
	text: string;
	textChange: Subject<string> = new Subject();

	colorList = {
		WHITE: '#ffffff',
		GRAY: '#eeeeee',
		TEAL: '#72cac4',
		YELLOW: '#e3e547',
		PINK: '#f59dba',
		ORANGE: '#fbac4b'
	};
	@Input() color;

	constructor(private mymicds: MyMICDS, private alertService: AlertService) {
		super();
	}

	ngOnInit() {
		this.textChange.debounceTime(1000).subscribe(
			text => {
				console.log('submitted');
				this.mymicds.stickyNotes.add({ moduleId: this._moduleId, text }).subscribe(
					success => {
						console.log(success);
					},
					error => {
						// tslint:disable-next-line:max-line-length
						this.alertService.addAlert('danger', 'Save Sticky Note Error!', 'There was a problem saving the sticky note. Your data is not yet saved.');
					}
				);
			}
		);
	}

}
