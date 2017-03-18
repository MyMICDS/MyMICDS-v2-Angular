import { Component, OnInit } from '@angular/core';
import { QuoteService } from '../../services/quote.service';
import { AlertService } from '../../services/alert.service';

@Component({
  selector: 'mymicds-quotes',
  templateUrl: './quotes.component.html',
  styleUrls: ['./quotes.component.scss']
})
export class QuotesComponent implements OnInit {
	
  constructor(private quote:QuoteService, private alertService:AlertService) { };

  ngOnInit() {
	  this.quote.getQuote().subscribe((result) => {
		  document.getElementById("quote").innerHTML = result.quote;
		  document.getElementById("author").innerHTML = "- " + result.author;
		  this.alertService.addAlert(null, "Quote", "Quote Retrieval Successful", 2);
	  });
  }
}