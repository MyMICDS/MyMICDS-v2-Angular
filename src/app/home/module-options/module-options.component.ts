import { Component, EventEmitter, Input, Output } from '@angular/core';
import { config, getDefaultOptions } from '../modules/module-config';
import { contains } from '../../common/utils';
import { Options, OptionsConfig } from '../modules/module-options';

@Component({
	selector: 'mymicds-module-options',
	templateUrl: './module-options.component.html',
	styleUrls: ['./module-options.component.scss']
})
export class ModuleOptionsComponent {
	private _type: string;
	private _options: Options = {};

	@Output() optionsChange = new EventEmitter<Options>();

	optionKeys: string[];
	optionsConfig: OptionsConfig;
	validOptions: Options;

	@Input()
	get type() {
		return this._type;
	}
	set type(name: string) {
		if (!config[name] || name === this.type) {
			return;
		}
		this._type = name;
		this.optionsConfig = config[name].options || {};
		this.optionKeys = Object.keys(this.optionsConfig);

		// Fall back to default options if none are provided
		this.options = {};
	}

	@Input()
	get options() {
		return this._options;
	}
	set options(newOptions: Options) {
		// Instead of replacing options, just override default options
		this._options = Object.assign({}, getDefaultOptions(this.type), this.options, newOptions);
	}

	constructor() {}

	valueChanged() {
		// Loop through all options and only emit ones valid
		const validOptions: Options = {};
		for (const optionKey of Object.keys(this.options)) {
			if (contains(this.optionKeys, optionKey)) {
				validOptions[optionKey] = this.options[optionKey];
			}
		}

		this.validOptions = validOptions;
		this.optionsChange.emit(validOptions);
	}
}
