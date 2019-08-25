/**
 * Class that will unsubscribe from all observables in a `subscriptions` array
 */

import { OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

export class SubscriptionsComponent implements OnDestroy {

	private subscriptions: Subscription[] = [];

	constructor() {
		// Even if ngOnDestory gets overriden by the child component, we can still unsubscribe from observables
		// (https://stacksandfoundations.wordpress.com/2016/06/24/using-class-inheritance-to-hook-to-angular2-component-lifecycle/)
		const childDestroy = this.ngOnDestroy.bind(this);
		this.ngOnDestroy = () => {
			if (childDestroy) {
				childDestroy();
			}
			this.unsubscribeObservables();
		};
	}

	ngOnDestroy() {}

	// Add any because Angualr complains if using MyMICDS observables which extend other classes
	addSubscription(subscription: Subscription | any) {
		this.subscriptions.push(subscription);
	}

	private unsubscribeObservables() {
		for (const subscription of this.subscriptions) {
			if (subscription && subscription.unsubscribe) {
				subscription.unsubscribe();
			}
		}
	}

}
