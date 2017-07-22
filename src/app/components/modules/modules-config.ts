export interface OptionsConfig {
	[option: string]: OptionConfig;
}

export interface OptionConfig {
	label: string;
	type: OptionType;
	default: OptionValue;
}

export interface Options {
	[option: string]: OptionValue;
}

export type OptionType = 'boolean' | 'number' | 'string';
export type OptionValue = boolean | number | string;
