export interface OptionsConfig {
	[option: string]: OptionConfig;
}

export interface OptionConfig {
	label?: string;
	type: OptionType;
	default: OptionValue;
	showIf?: Options;
}

export interface Options {
	[option: string]: OptionValue;
}

export type OptionType = 'boolean' | 'number' | 'string' | 'Date' | 'ICON' | OptionEnum;
export type OptionValue = boolean | number | string | Date | OptionEnumValue;

export interface OptionEnum {
	name: string;
	values: OptionEnumValue[];
}

export interface OptionEnumValue {
	name: string;
	value: unknown;
}
