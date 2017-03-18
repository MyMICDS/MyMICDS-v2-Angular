import { Component, OnInit } from '@angular/core';
import { QuoteService } from '../../services/quote.service';

@Component({
  selector: 'mymicds-quotes',
  templateUrl: './quotes.component.html',
  styleUrls: ['./quotes.component.scss']
})
export class QuotesComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }
  
  getQuote() {
	alert("Hellow rodl");
  }
}