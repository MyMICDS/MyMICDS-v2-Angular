import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Options, OptionConfig, OptionValue } from '../../modules/module-options';

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
		this.checkIfShow();
	}
	private _config: OptionConfig;

	// Other options in the form
	@Input()
	get otherOptions() {
		return this._otherOptions;
	}
	set otherOptions(newValue: Options) {
		this._otherOptions = newValue;
		this.checkIfShow();
	}
	private _otherOptions: Options;

	@Input() value: OptionValue;
	@Output() valueChange = new EventEmitter<OptionValue>();

	show = true;
	select = false;

	// Date picker stuff
	showPicker = false;
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

	changeDate(date) {
		this.value = date;
		this.valueChange.emit(this.value);
	}

	checkIfShow() {
		if (this.otherOptions && this.config && typeof this.config.showIf === 'object') {
			const showIf = this.config.showIf;
			let valid = true;
			for (const variable of Object.keys(showIf)) {
				if (this.otherOptions[variable] !== showIf[variable]) {
					valid = false;
				}
			}
			this.show = valid;
		} else {
			this.show = true;
		}
	}

	changeIcon(icon: string) {
		// Get rid of the 'fa ' at the beginning
		const split = icon.split(' ');
		this.value = split[split.length - 1];
		this.valueChange.emit(this.value);
	}

}
