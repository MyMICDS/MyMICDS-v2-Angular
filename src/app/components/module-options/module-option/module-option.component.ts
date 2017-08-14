import { Component, Input, Output, EventEmitter } from '@angular/core';
import { OptionConfig, OptionValue } from '../../modules/modules-config';

@Component({
	selector: 'mymicds-module-option',
	templateUrl: './module-option.component.html',
	styleUrls: ['./module-option.component.scss']
})
export class ModuleOptionComponent {

	@Input() config: OptionConfig;

	@Input() value: OptionValue;
	@Output() valueChange = new EventEmitter<OptionValue>();

	currDate: Date;

	constructor() {
		this.valueChange.debounceTime(50);
	}

	dateChange(d) {
		this.currDate = d;
		this.valueChange.emit(d);
	}

	dateHourChange(h) {
		this.currDate.setHours(h);
		this.valueChange.emit(this.currDate);
	}

	dateMinuteChange(m) {
		this.currDate.setMinutes(m);
		this.valueChange.emit(this.currDate);
	}

}
