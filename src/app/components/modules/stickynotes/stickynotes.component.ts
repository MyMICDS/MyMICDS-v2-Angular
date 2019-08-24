import { MyMICDS } from '@mymicds/sdk';

import { Component, OnInit, Input, ViewChild, ElementRef, NgZone } from '@angular/core';
import { Subject } from 'rxjs/Rx';
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

	@ViewChild('moduleContainer', { static: true }) moduleContainer: ElementRef;
	moduleWidth: number;
	resizeSensorModuleContainer: ResizeSensor;

	@Input()
	get fixedHeight() {
		return this._fixedHeight;
	}
	set fixedHeight(fixed: boolean) {
		this._fixedHeight = fixed;
	}
	private _fixedHeight: boolean;

	private _moduleId: string;
	@Input() set moduleId(id) {
		if (this._moduleId !== id) {
			this._moduleId = id;
			this.addSubscription(
				this.mymicds.stickyNotes.get({ moduleId: id }).subscribe(data => {
					this.ngZone.run(() => {
						this.text = data.text;
					});
				})
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

	constructor(private mymicds: MyMICDS, private ngZone: NgZone) {
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
