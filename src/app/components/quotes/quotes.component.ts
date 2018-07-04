import { MyMICDS } from '@mymicds/sdk';
import { Component, OnInit } from '@angular/core';
import { SubscriptionsComponent } from '../../common/subscriptions-component';

@Component({
	selector: 'mymicds-quotes',
	templateUrl: './quotes.component.html',
	styleUrls: ['./quotes.component.scss']
})
export class QuotesComponent extends SubscriptionsComponent implements OnInit {

	quote = 'Getting quote...';
	author = 'Getting author...';

	constructor(private mymicds: MyMICDS) {
		super();
	};

	ngOnInit() {
		this.addSubscription(
			this.mymicds.quotes.get().subscribe((result) => {
				this.quote = '"' + result.quote.quote + '"';
				this.author = '- ' + result.quote.author;
			})
		);
	}
}
