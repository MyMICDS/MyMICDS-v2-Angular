import {Directive, ElementRef} from '@angular/core';
import {BackgroundService} from '../services/background.service';

@Directive({ selector: '[blur]' })
export class BlurDirective {
	constructor(private el: ElementRef, private backgroundService: BackgroundService) {}

	subscription:any;

	ngOnInit() {
		this.el.nativeElement.style.background = 'linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url("' + this.backgroundService.variants.blur + '")';
		this.el.nativeElement.style.backgroundSize = 'cover';
		this.el.nativeElement.style.backgroundAttachment = 'fixed';
		this.subscription = this.backgroundService.backgroundChange$.subscribe(
			blurURL => {
				this.el.nativeElement.style.background = 'linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url("' + blurURL + '")';
				this.el.nativeElement.style.backgroundSize = 'cover';
				this.el.nativeElement.style.backgroundAttachment = 'fixed';
			}
		);
	}

	ngOnDestroy() {
		this.subscription.unsubscribe();
	}
}

@Directive({ selector: '[blur--dark]' })
export class DarkBlurDirective {
	constructor(private el: ElementRef, private backgroundService: BackgroundService) {}

	subscription:any;

	ngOnInit() {
		this.el.nativeElement.style.background = 'linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.8)), url("' + this.backgroundService.variants.blur + '")';
		this.el.nativeElement.style.backgroundSize = 'cover';
		this.el.nativeElement.style.backgroundAttachment = 'fixed';
		this.subscription = this.backgroundService.backgroundChange$.subscribe(
			blurURL => {
				this.el.nativeElement.style.background = 'linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.8)), url("' + blurURL + '")';
				this.el.nativeElement.style.backgroundSize = 'cover';
				this.el.nativeElement.style.backgroundAttachment = 'fixed';
			}
		);
	}

	ngOnDestroy() {
		this.subscription.unsubscribe();
	}
}

@Directive({ selector: '[blur--white]' })
export class WhiteBlurDirective {
	constructor(private el: ElementRef, private backgroundService: BackgroundService) {}

	subscription:any;

	ngOnInit() {
		this.el.nativeElement.style.background = 'linear-gradient(rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0.5)), url("' + this.backgroundService.variants.blur + '")';
		this.el.nativeElement.style.backgroundSize = 'cover';
		this.el.nativeElement.style.backgroundAttachment = 'fixed';
		this.subscription = this.backgroundService.backgroundChange$.subscribe(
			blurURL => {
				this.el.nativeElement.style.background = 'linear-gradient(rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0.5)), url("' + blurURL + '")';
				this.el.nativeElement.style.backgroundSize = 'cover';
				this.el.nativeElement.style.backgroundAttachment = 'fixed';
			}
		);
	}

	ngOnDestroy() {
		this.subscription.unsubscribe();
	}
}
