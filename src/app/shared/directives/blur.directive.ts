/* eslint-disable max-len */

import { MyMICDS } from '@mymicds/sdk';
import { Directive, ElementRef, OnInit } from '@angular/core';
import { SubscriptionsComponent } from '../../common/subscriptions-component';

@Directive({
	selector: '[mymicds-blur]' // eslint-disable-line
})
export class BlurDirective extends SubscriptionsComponent implements OnInit {
	subscription: any;

	constructor(private mymicds: MyMICDS, private el: ElementRef) {
		super();
	}

	ngOnInit() {
		this.subscription = this.mymicds.background.$.subscribe(background => {
			this.el.nativeElement.style.background =
				'linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url("' +
				background.variants.blur +
				'")';
			this.el.nativeElement.style.backgroundSize = 'cover';
			this.el.nativeElement.style.backgroundAttachment = 'fixed';
		});
	}
}

@Directive({
	selector: '[mymicds-blur--dark]' // eslint-disable-line
})
export class DarkBlurDirective extends SubscriptionsComponent implements OnInit {
	subscription: any;

	constructor(private mymicds: MyMICDS, private el: ElementRef) {
		super();
	}

	ngOnInit() {
		this.subscription = this.mymicds.background.$.subscribe(background => {
			this.el.nativeElement.style.background =
				'linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.8)), url("' +
				background.variants.blur +
				'")';
			this.el.nativeElement.style.backgroundSize = 'cover';
			this.el.nativeElement.style.backgroundAttachment = 'fixed';
		});
	}
}

@Directive({
	selector: '[mymicds-blur--white]' // eslint-disable-line
})
export class WhiteBlurDirective extends SubscriptionsComponent implements OnInit {
	subscription: any;

	constructor(private mymicds: MyMICDS, private el: ElementRef) {
		super();
	}

	ngOnInit() {
		this.subscription = this.mymicds.background.$.subscribe(background => {
			this.el.nativeElement.style.background =
				'linear-gradient(rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0.5)), url("' +
				background.variants.blur +
				'")';
			this.el.nativeElement.style.backgroundSize = 'cover';
			this.el.nativeElement.style.backgroundAttachment = 'fixed';
		});
	}
}
