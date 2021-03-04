import {
	Component,
	Input,
	ViewChild,
	ViewContainerRef,
	ComponentFactoryResolver,
	ComponentRef
} from '@angular/core';
import { config, ModuleConfig } from '../../home/modules/module-config';

@Component({
	selector: 'mymicds-module-container',
	templateUrl: './module-container.component.html',
	styleUrls: ['./module-container.component.scss']
})
export class ModuleContainerComponent {
	private currentModuleRef: ComponentRef<any> | null = null;
	private currentModuleType: string | null = null;
	currentModuleConfig: ModuleConfig | null = null;

	private currentInputs: { [key: string]: any };

	@ViewChild('module', { read: ViewContainerRef, static: true })
	dynamicModuleContainer: ViewContainerRef;

	@Input()
	set type(type: string) {
		if (type !== this.currentModuleType) {
			// We create a factory out of the component we want to create

			// If invalid module type, ignore
			if (!config[type]) {
				return;
			}

			this.currentModuleConfig = config[type];

			const factory = this.resolver.resolveComponentFactory(
				this.currentModuleConfig.component
			);
			this.dynamicModuleContainer.clear();
			this.currentModuleRef = this.dynamicModuleContainer.createComponent(factory);
		}

		// Assign inputs to the injected component
		if (this.currentInputs) {
			Object.assign(this.currentModuleRef!.instance, this.inputs);
		}

		this.currentModuleType = type;
	}

	@Input()
	set inputs(inputs: { [key: string]: any }) {
		if (this.currentModuleRef) {
			Object.assign(this.currentModuleRef.instance, inputs);
		}
		this.currentInputs = inputs;
	}

	@Input()
	set moduleId(id: string) {
		if (this.currentModuleRef) {
			Object.assign(this.currentModuleRef.instance, { moduleId: id });
		}
	}

	@Input()
	set fixedHeight(fixed: boolean) {
		if (this.currentModuleRef) {
			Object.assign(this.currentModuleRef.instance, { fixedHeight: fixed });
		}
	}

	constructor(private resolver: ComponentFactoryResolver) {}
}
