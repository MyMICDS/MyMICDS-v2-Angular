import { MyMICDS, GetSnowdayResponse } from '@mymicds/sdk';

import { Component, OnInit, ViewChild, ElementRef, NgZone } from '@angular/core';
import * as ElementQueries from 'css-element-queries/src/ElementQueries';
import ResizeSensor from 'css-element-queries/src/ResizeSensor';

import { SubscriptionsComponent } from '../../../common/subscriptions-component';

@Component({
	selector: 'mymicds-snowday',
	templateUrl: './snowday.component.html',
	styleUrls: ['./snowday.component.scss']
})
export class SnowdayComponent extends SubscriptionsComponent implements OnInit {

	@ViewChild('moduleContainer') moduleContainer: ElementRef;
	moduleWidth: number;
	moduleHeight: number;
	resizeSensor: ResizeSensor;

	snowdayData: GetSnowdayResponse['data'] = null;

	constructor(private mymicds: MyMICDS, private ngZone: NgZone) {
		super();
	}

	ngOnInit() {
		ElementQueries.init();
		const onResize = () => {
			this.moduleWidth = this.moduleContainer.nativeElement.clientWidth;
			this.moduleHeight = this.moduleContainer.nativeElement.clientHeight;
		};
		onResize();
		this.resizeSensor = new ResizeSensor(this.moduleContainer.nativeElement, onResize);

		this.addSubscription(
			this.mymicds.snowday.get().subscribe(({ data }) => {
				this.ngZone.run(() => {
					this.snowdayData = data;
				});
			})
		);
	}

}
