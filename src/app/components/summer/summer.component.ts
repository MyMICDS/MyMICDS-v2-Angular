import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
	selector: 'mymicds-summer',
	templateUrl: './summer.component.html',
	styleUrls: ['./summer.component.scss']
})
export class SummerComponent {
	@Input() showSummer: boolean;
	@Output() showSummerChange = new EventEmitter<boolean>();

	continue() {
		console.log('click!');
		this.showSummer = false;
		this.showSummerChange.emit(false);
		sessionStorage.setItem('shownSummer', 'true');
	}
}
