import { ModuleType } from '../../services/modules.service';

export const modules: Array<{ [name: string]: Function }> = [];

// Module decorator
export function MyMICDSModule(name: ModuleType /* config: ModuleConfig */) {
	return target => {
		modules.push({ [name]: target });
	};
}
