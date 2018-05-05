export interface OptionsConfig {
	[option: string]: OptionConfig;
}

export interface OptionConfig {
	label?: string;
	type: OptionType;
	default: OptionValue;
	showIf?: { [variable: string]: any };
}

export interface Options {
	[option: string]: OptionValue;
}

export type OptionType = 'boolean' | 'number' | 'string' | 'Date' | OptionEnum;
export type OptionValue = boolean | number | string | Date | OptionEnumValue;

export interface OptionEnum {
	name: string;
	values: OptionEnumValue[];
}

export interface OptionEnumValue {
	name: string;
	value: any;
}
