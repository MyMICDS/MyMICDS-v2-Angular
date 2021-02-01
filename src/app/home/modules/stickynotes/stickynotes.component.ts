import { MyMICDS } from '@mymicds/sdk';

import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import ResizeSensor from 'css-element-queries/src/ResizeSensor';

import { SubscriptionsComponent } from '../../../common/subscriptions-component';

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
;

	@ViewChild('moduleContainer', { static: true }) moduleContainer: ElementRef;
	moduleWidth: number;
	resizeSensorModuleContainer: ResizeSensor;
	private _fixedHeight: boolean;

	private _moduleId: string;

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
	@Input() color: COLOR;

	@Input()
	get fixedHeight() {
		return this._fixedHeight;
	}
	set fixedHeight(fixed: boolean) {
		this._fixedHeight = fixed;
	}
	@Input() set moduleId(id: string) {
		if (this._moduleId !== id) {
			this._moduleId = id;
			this.addSubscription(
				this.mymicds.stickyNotes.get({ moduleId: id }).subscribe(data => {
					this.text = data.text;
				})
			);
		}
	}
	constructor(private mymicds: MyMICDS) {
		super();
	}

	ngOnInit() {
		// Detect when module resizes
		const onModuleResize = () => {
			this.moduleWidth = this.moduleContainer.nativeElement.clientWidth;
		};
		onModuleResize();
		this.resizeSensorModuleContainer = new ResizeSensor(this.moduleContainer.nativeElement, onModuleResize);

		this.addSubscription(
			this.textChange.pipe(debounceTime(1000)).subscribe(
				text => {
					console.log('submitted');
					this.mymicds.stickyNotes.add({ moduleId: this._moduleId, text }).subscribe(success => {
						// @todo Have feedback when stickynote is saved
						console.log(success);
					});
				}
			)
		);
	}

}
