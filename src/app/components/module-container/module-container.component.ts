import { Component, Input, ViewChild, ViewContainerRef, ComponentFactoryResolver } from '@angular/core';
import { modules } from '../modules/modules-main';

@Component({
	selector: 'mymicds-module-container',
	templateUrl: './module-container.component.html',
	styleUrls: ['./module-container.component.scss']
})
export class ModuleContainerComponent {
	private currentModuleRef = null;
	private currentModuleType: string = null;

	private currentInputs: { [key: string]: any };

	@ViewChild('module', { read: ViewContainerRef }) dynamicModuleContainer: ViewContainerRef;

	@Input()
	set type(type: string) {
		if (type !== this.currentModuleType) {
			// We create a factory out of the component we want to create
			const factory = this.resolver.resolveComponentFactory(modules[type].component);
			this.dynamicModuleContainer.clear();
			this.currentModuleRef = this.dynamicModuleContainer.createComponent(factory);
		}

		// Assign inputs to the injected component
		if (this.currentInputs) {
			Object.assign(this.currentModuleRef.instance, this.inputs);
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

	constructor(private resolver: ComponentFactoryResolver) { }

}
