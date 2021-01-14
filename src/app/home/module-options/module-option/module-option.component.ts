import { Component, Input, Output, EventEmitter, Injectable } from '@angular/core';
import { debounceTime } from 'rxjs/operators';
import { Options, OptionConfig, OptionValue } from '../../modules/module-options';
import { NgbDateStruct, NgbDateAdapter } from "@ng-bootstrap/ng-bootstrap";

@Injectable()
export class CustomDateAdapter extends NgbDateAdapter<Date> {

  fromModel(value: Date): NgbDateStruct | null {
    if (value instanceof Date) { // when switching from ngx-bootstrap to ng-bootstrap in 1/11/2020, value might be a string, this is a safeguard.
      return {
        day: value.getUTCDate(),
        month: value.getUTCMonth() + 1,
        year: value.getUTCFullYear()
      };
    } else if (typeof value == "string") {
		const stringDate = new Date(value);
		return {
			day: stringDate.getUTCDate(),
			month: stringDate.getUTCMonth() + 1,
			year: stringDate.getUTCFullYear()
		  };
	}
    return null;
  }

  toModel(date: NgbDateStruct | null): Date | null {
	if (date) {
		const newDate = new Date();
		newDate.setUTCFullYear(date.year);
		newDate.setUTCMonth(date.month - 1);
		newDate.setUTCDate(date.day);
		newDate.setUTCHours(6);
		newDate.setUTCMinutes(0);
		return newDate;
	}
    return null;
  }
}


@Component({
	selector: 'mymicds-module-option',
	templateUrl: './module-option.component.html',
	styleUrls: ['./module-option.component.scss'],
	providers: [
		{provide: NgbDateAdapter, useClass: CustomDateAdapter}
	]
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
	
	changeIcon(icon: string) {
		// Get rid of the 'fa ' at the beginning
		const split = icon.split(' ');
		this.value = split[split.length - 1];
		this.valueChange.emit(this.value);
	}
}