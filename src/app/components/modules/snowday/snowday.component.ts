import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import * as ElementQueries from 'css-element-queries/src/ElementQueries';
import * as ResizeSensor from 'css-element-queries/src/ResizeSensor';

import { AlertService } from '../../../services/alert.service';
import { SnowdayService } from '../../../services/snowday.service';

@Component({
	selector: 'mymicds-snowday',
	templateUrl: './snowday.component.html',
	styleUrls: ['./snowday.component.scss']
})
export class SnowdayComponent implements OnInit, OnDestroy {

	@ViewChild('moduleContainer') moduleContainer: ElementRef;
	moduleWidth: number;
	moduleHeight: number;

	snowdayData: any = null;
	subscription: any;

	constructor(private alertService: AlertService, private snowdayService: SnowdayService) { }

	ngOnInit() {
		ElementQueries.listen();
		ElementQueries.init();
		const onResize = () => {
			this.moduleWidth = this.moduleContainer.nativeElement.clientWidth;
			this.moduleHeight = this.moduleContainer.nativeElement.clientHeight;
		};
		onResize();
		new ResizeSensor(this.moduleContainer.nativeElement, onResize);

		this.subscription = this.snowdayService.calculate().subscribe(
			data => {
				this.snowdayData = data;
			},
			error => {
				this.alertService.addAlert('danger', 'Snowday Calculator Error!', error);
			}
		);
	}

	ngOnDestroy() {
		// Unsubscribe to prevent memory leaks or something
		this.subscription.unsubscribe();
	}

}
