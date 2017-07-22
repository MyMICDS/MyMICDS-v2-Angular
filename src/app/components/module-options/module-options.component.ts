import { Component, Input, Output, EventEmitter } from '@angular/core';
import { modules } from '../modules/modules-main';
import { OptionsConfig, Options, OptionValue } from '../modules/modules-config';

@Component({
	selector: 'mymicds-module-options',
	templateUrl: './module-options.component.html',
	styleUrls: ['./module-options.component.scss']
})
export class ModuleOptionsComponent {

	@Input()
	set module(name: string) {
		if (!modules[name]) {
			return;
		}
		this.optionsConfig = modules[name].options;
		this.optionKeys = Object.keys(this.optionsConfig);

		const defaultOptions = {};
		for (const optionKey of this.optionKeys) {
			defaultOptions[optionKey] = this.optionsConfig[optionKey].default;
		}
		this.emitIfDifferent(defaultOptions);
	}

	currentOptions: Options;
	@Output() options = new EventEmitter();

	optionKeys: string[];
	optionsConfig: OptionsConfig;

	constructor() { }

	changeValue(optionKey: string, value: OptionValue) {
		const newOptions = JSON.parse(JSON.stringify(this.currentOptions));
		newOptions[optionKey] = value;
		this.emitIfDifferent(newOptions);
	}

	emitIfDifferent(options: Options) {
		if (JSON.stringify(options) === JSON.stringify(this.currentOptions)) {
			return;
		}
		this.currentOptions = options;
		this.options.emit(this.currentOptions);
	}

}
