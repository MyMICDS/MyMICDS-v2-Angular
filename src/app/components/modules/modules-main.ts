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

interface ModuleConfig {
	name: ModuleType;
	icon: string;
	initHeight: number;
	initWidth: number;
}
