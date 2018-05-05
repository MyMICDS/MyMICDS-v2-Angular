import { Component, Input, Output, EventEmitter } from '@angular/core';
import { OptionConfig, OptionValue } from '../../modules/module-options';

@Component({
	selector: 'mymicds-module-option',
	templateUrl: './module-option.component.html',
	styleUrls: ['./module-option.component.scss']
})
export class ModuleOptionComponent {

	@Input()
	get config() {
		return this._config;
	}
	set config(newValue: OptionConfig) {
		this._config = newValue;
		this.select = (typeof this.config.type === 'object' && typeof this.config.type.name !== 'undefined');
	}
	private _config: OptionConfig;

	@Input() value: OptionValue;
	@Output() valueChange = new EventEmitter<OptionValue>();

	select = false;

	// Date picker stuff
	currDate: Date = new Date();
	showPicker = false;
	showDate = true;
	showTime = true;
	clearButton: any = { show: false };
	nowButton: any = { show: true, label: 'Today', cssClass: 'btn btn-info' };
	closeButton: any = { show: true, label: 'Enter', cssClass: 'btn btn-primary' };

	constructor() {
		this.valueChange.debounceTime(50);
	}

	onTogglePicker() {
		if (this.showPicker === false) {
			this.showPicker = true;
		}
	}

	changeDate(d) {
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
