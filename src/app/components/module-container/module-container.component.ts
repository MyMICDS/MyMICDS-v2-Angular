import { Component, Input, OnInit, ViewChild, ViewContainerRef, ComponentFactoryResolver } from '@angular/core';
import { modules } from '../modules/modules-main';

@Component({
	selector: 'mymicds-module-container',
	templateUrl: './module-container.component.html',
	styleUrls: ['./module-container.component.scss']
})
export class ModuleContainerComponent implements OnInit {
	currentModule = null;
	currentModuleRef = null;
	currentModuleType: string = null;

	@ViewChild('module', { read: ViewContainerRef }) dynamicModuleContainer: ViewContainerRef;

	@Input()
	set moduleData(data: { type: string, inputs: any }) {
		if (!data || !modules[data.type]) {
			return;
		}

		if (data.type !== this.currentModuleType) {
			// We create a factory out of the component we want to create
			const factory = this.resolver.resolveComponentFactory(modules[data.type].component);
			this.dynamicModuleContainer.clear();
			this.currentModuleRef = this.dynamicModuleContainer.createComponent(factory);
		}

		// Assign inputs to the injected component
		Object.assign(this.currentModuleRef.instance, data.inputs);

		this.currentModuleType = data.type;
	}

	constructor(private resolver: ComponentFactoryResolver) { }

	ngOnInit() {
	}
}
