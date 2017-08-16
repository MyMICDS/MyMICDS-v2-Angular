export interface OptionsConfig {
	[option: string]: OptionConfig;
}

export interface OptionConfig {
	label: string;
	type: OptionType;
	default: OptionValue;
	select?: boolean;
	selectItems?: OptionValue[];
}

export interface Options {
	[option: string]: OptionValue;
}

export type OptionType = 'boolean' | 'number' | 'string' | 'Date';
export type OptionValue = boolean | number | string | Date;
