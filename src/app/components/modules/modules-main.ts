import { OptionsConfig } from './modules-config';

export const modules: {[name: string]: ModuleList} = {};

// Module decorator
export function MyMICDSModule(config: ModuleConfig) {
	return target => {
		modules[config.name] = {
			component: target,
			icon: config.icon,
			defaultHeight: config.defaultHeight,
			defaultWidth: config.defaultWidth,
			options: config.options || {}
		};
	};
}

// This has to be its own function because for some reason, Angular doesn't allow lambdas in NgModule decorators
export function getModuleComponent(key: string) {
	return modules[key].component;
}

interface ModuleConfigBase {
	icon: string;
	defaultHeight: number;
	defaultWidth: number;
	options?: OptionsConfig;
}

interface ModuleConfig extends ModuleConfigBase {
	name: string;
}

interface ModuleList extends ModuleConfigBase {
	component: any;
}
