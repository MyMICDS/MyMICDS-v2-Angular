import { ModuleType } from '../../services/modules.service';

export const modules: {[name: string]: {component: any, icon: string, initHeight: number, initWidth: number}} = {};

// Module decorator
export function MyMICDSModule(config: ModuleConfig) {
	return target => {
		modules[config.name] = {
			component: target,
			icon: config.icon,
			initHeight: config.initHeight,
			initWidth: config.initWidth
		};
	};
}

// This has to be its own function because for some reason, Angular doesn't allow lambdas in NgModule decorators
export function getModuleComponent(key: string) {
	return modules[key].component;
}

interface ModuleConfig {
	name: ModuleType;
	icon: string;
	initHeight: number;
	initWidth: number;
}
