import { MyMICDS } from '@mymicds/sdk';

import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import * as ElementQueries from 'css-element-queries/src/ElementQueries';
import * as ResizeSensor from 'css-element-queries/src/ResizeSensor';

import { SubscriptionsComponent } from '../../../common/subscriptions-component';
import { AlertService } from '../../../services/alert.service';

@Component({
	selector: 'mymicds-snowday',
	templateUrl: './snowday.component.html',
	styleUrls: ['./snowday.component.scss']
})
export class SnowdayComponent extends SubscriptionsComponent implements OnInit {

	@ViewChild('moduleContainer') moduleContainer: ElementRef;
	moduleWidth: number;
	moduleHeight: number;

	snowdayData: any = null;

	constructor(private mymicds: MyMICDS, private alertService: AlertService) {
		super();
	}

	ngOnInit() {
		ElementQueries.listen();
		ElementQueries.init();
		const onResize = () => {
			this.moduleWidth = this.moduleContainer.nativeElement.clientWidth;
			this.moduleHeight = this.moduleContainer.nativeElement.clientHeight;
		};
		onResize();
		new ResizeSensor(this.moduleContainer.nativeElement, onResize);

		this.addSubscription(
			this.mymicds.snowday.get().subscribe(
				data => {
					this.snowdayData = data;
				},
				error => {
					this.alertService.addAlert('danger', 'Snowday Calculator Error!', error);
				}
			)
		);
	}

}
