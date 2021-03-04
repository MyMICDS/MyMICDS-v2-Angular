/**
 * Class that will unsubscribe from all observables in a `subscriptions` array
 */

import { Injectable, OnDestroy } from '@angular/core';
import { SubscriptionLike } from 'rxjs';

@Injectable()
export abstract class SubscriptionsComponent implements OnDestroy {
	private subscriptions: SubscriptionLike[] = [];

	protected constructor() {
		// Even if ngOnDestroy gets overridden by the child component, we can still unsubscribe from observables
		// (https://stacksandfoundations.wordpress.com/2016/06/24/using-class-inheritance-to-hook-to-angular2-component-lifecycle/)
		const childDestroy = this.ngOnDestroy.bind(this);
		this.ngOnDestroy = () => {
			if (childDestroy) {
				childDestroy();
			}
			this.unsubscribeObservables();
		};
	}

	private unsubscribeObservables() {
		for (const subscription of this.subscriptions) {
			subscription.unsubscribe();
		}
	}

	// eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method,@typescript-eslint/no-empty-function
	ngOnDestroy() {}

	addSubscription(subscription: SubscriptionLike) {
		this.subscriptions.push(subscription);
	}
}
