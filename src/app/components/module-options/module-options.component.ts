import { Component, Input, Output, EventEmitter } from '@angular/core';
import { modules, getDefaultOptions } from '../modules/modules-main';
import { OptionsConfig, Options } from '../modules/modules-config';

@Component({
	selector: 'mymicds-module-options',
	templateUrl: './module-options.component.html',
	styleUrls: ['./module-options.component.scss']
})
export class ModuleOptionsComponent {

	@Input()
	set type(name: string) {
		if (!modules[name]) {
			return;
		}
		this.optionsConfig = modules[name].options;
		this.optionKeys = Object.keys(this.optionsConfig);

		// Fall back to default options if none are provided
		if (!this.options) {
			this.options = getDefaultOptions(name);
		}
	}

	@Input() options: Options;
	@Output() optionsChange = new EventEmitter<Options>();

	optionKeys: string[];
	optionsConfig: OptionsConfig;

	constructor() { }

	valueChanged() {
		this.optionsChange.emit(JSON.parse(JSON.stringify(this.options)));
	}

}
