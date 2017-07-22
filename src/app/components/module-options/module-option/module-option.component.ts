import { Component, Input, Output, EventEmitter } from '@angular/core';
import { OptionConfig } from '../../modules/modules-config';

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
	set config(value: OptionConfig) {
		this._config = value;
		this.inputValue = value.default;
	}
	private _config: OptionConfig;

	get inputValue() {
		return this._inputValue;
	}
	set inputValue(value: boolean | number | string) {
		this._inputValue = value;
		this.value.emit(value);
	}
	private _inputValue: boolean | number | string;

	@Output() value = new EventEmitter<boolean | number | string>();

	constructor() { }

}
