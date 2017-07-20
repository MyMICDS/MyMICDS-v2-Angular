/* tslint:disable:max-line-length */

import { Directive, ElementRef, OnInit, OnDestroy } from '@angular/core';
import { BackgroundService } from '../services/background.service';

@Directive({
	selector: '[mymicds-blur]' // tslint:disable-line
})
export class BlurDirective implements OnInit, OnDestroy {

	subscription: any;

	constructor(
		private el: ElementRef,
		private backgroundService: BackgroundService
	) { }

	ngOnInit() {
		this.subscription = this.backgroundService.background$.subscribe(
			background => {
				this.el.nativeElement.style.background = 'linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url("' + background.variants.blur + '")';
				this.el.nativeElement.style.backgroundSize = 'cover';
				this.el.nativeElement.style.backgroundAttachment = 'fixed';
			}
		);
	}

	ngOnDestroy() {
		this.subscription.unsubscribe();
	}

}

@Directive({
	selector: '[mymicds-blur--dark]' // tslint:disable-line
})
export class DarkBlurDirective implements OnInit, OnDestroy {

	subscription: any;

	constructor(
		private el: ElementRef,
		private backgroundService: BackgroundService
	) { }


	ngOnInit() {
		this.subscription = this.backgroundService.background$.subscribe(
			background => {
				this.el.nativeElement.style.background = 'linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.8)), url("' + background.variants.blur + '")';
				this.el.nativeElement.style.backgroundSize = 'cover';
				this.el.nativeElement.style.backgroundAttachment = 'fixed';
			}
		);
	}

	ngOnDestroy() {
		this.subscription.unsubscribe();
	}
}

@Directive({
	selector: '[mymicds-blur--white]' // tslint:disable-line
})
export class WhiteBlurDirective implements OnInit, OnDestroy {

	subscription: any;

	constructor(
		private el: ElementRef,
		private backgroundService: BackgroundService
	) { }

	ngOnInit() {
		this.subscription = this.backgroundService.background$.subscribe(
			background => {
				this.el.nativeElement.style.background = 'linear-gradient(rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0.5)), url("' + background.variants.blur + '")';
				this.el.nativeElement.style.backgroundSize = 'cover';
				this.el.nativeElement.style.backgroundAttachment = 'fixed';
			}
		);
	}

	ngOnDestroy() {
		this.subscription.unsubscribe();
	}
}
