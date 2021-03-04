import { GetSnowdayResponse, MyMICDS } from '@mymicds/sdk';

import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ElementQueries, ResizeSensor } from 'css-element-queries';

import { SubscriptionsComponent } from '../../../common/subscriptions-component';

@Component({
	selector: 'mymicds-snowday',
	templateUrl: './snowday.component.html',
	styleUrls: ['./snowday.component.scss']
})
export class SnowdayComponent extends SubscriptionsComponent implements OnInit {
	@ViewChild('moduleContainer', { static: true }) moduleContainer: ElementRef;
	moduleWidth: number;
	moduleHeight: number;
	resizeSensor: ResizeSensor;

	snowdayData: GetSnowdayResponse['data'] | null = null;

	constructor(private mymicds: MyMICDS) {
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
				this.snowdayData = data;
			})
		);
	}
}
