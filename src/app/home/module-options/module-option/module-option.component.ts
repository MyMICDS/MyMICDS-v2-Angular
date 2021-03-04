import { Component, Input, Output, EventEmitter } from '@angular/core';
import { debounceTime } from 'rxjs/operators';
import { Options, OptionConfig, OptionValue } from '../../modules/module-options';

import { IconDefinition } from '@fortawesome/fontawesome-common-types';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { NgbDateAdapter, NgbDateNativeAdapter } from '@ng-bootstrap/ng-bootstrap';

@Component({
	selector: 'mymicds-module-option',
	templateUrl: './module-option.component.html',
	styleUrls: ['./module-option.component.scss'],
	providers: [{ provide: NgbDateAdapter, useClass: NgbDateNativeAdapter }]
})
export class ModuleOptionComponent {
	private _config: OptionConfig;
	private _otherOptions: Options;

	@Input() value: OptionValue;
	@Output() valueChange = new EventEmitter<OptionValue>();

	show = true;
	select = false;

	// Needed to access icon library in template
	fas = fas;
	iconSearchValue = '';

	@Input()
	get config() {
		return this._config;
	}
	set config(newValue: OptionConfig) {
		this._config = newValue;
		this.select =
			typeof this.config.type === 'object' && typeof this.config.type.name !== 'undefined';
		this.checkIfShow();
	}

	// Other options in the form
	@Input()
	get otherOptions() {
		return this._otherOptions;
	}
	set otherOptions(newValue: Options) {
		this._otherOptions = newValue;
		this.checkIfShow();
	}

	// Date picker stuff

	constructor(private dateAdapter: NgbDateAdapter<Date>) {
		this.valueChange.pipe(debounceTime(50));
	}

	changeDate(date: Date) {
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

	// Icon stuff
	changeIcon({ iconName }: IconDefinition) {
		this.value = iconName;
		this.valueChange.emit(iconName);
	}
}
