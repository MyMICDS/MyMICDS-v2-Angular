import { ModuleType } from '../../services/modules.service';

export const modules: any = {};

// Module decorator
export function MyMICDSModule(name: ModuleType /* config: ModuleConfig */) {
	return target => {
		modules[name] = target;
	};
}
