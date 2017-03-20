import { Component, OnInit } from '@angular/core';
import { QuoteService } from '../../services/quote.service';


@Component({
	selector: 'mymicds-quotes',
	templateUrl: './quotes.component.html',
	styleUrls: ['./quotes.component.scss']
})
export class QuotesComponent implements OnInit {

	quote = 'Getting quote...';
	author = 'Getting author...';

	constructor(private quoteService: QuoteService) { };

	ngOnInit() {
		this.quoteService.getQuote().subscribe((result) => {
			this.quote = '"' + result.quote + '"';
			this.author = '- ' + result.author;
		});
	}
}
