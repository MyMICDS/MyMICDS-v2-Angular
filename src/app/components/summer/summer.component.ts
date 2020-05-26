import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
	selector: 'mymicds-summer',
	templateUrl: './summer.component.html',
	styleUrls: ['./summer.component.scss']
})
export class SummerComponent implements OnInit {

	@Input() showSummer: boolean;
	@Output() showSummerChange = new EventEmitter<boolean>();

	constructor() { }

	ngOnInit() {
	}

	continue() {
		console.log('click!');
		this.showSummer = false;
		this.showSummerChange.emit(false);
		sessionStorage.setItem('shownSummer', 'true');
	}

}
