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

	constructor() { }

}
