import { Component, OnInit, OnDestroy } from '@angular/core';
import * as interact from 'interactjs';

import { modules, getDefaultOptions } from '../modules/modules-main';
import { Options } from '../modules/modules-config';

@Component({
	selector: 'mymicds-module-inspector',
	templateUrl: './module-inspector.component.html',
	styleUrls: ['./module-inspector.component.scss']
})
export class ModuleInspectorComponent implements OnInit, OnDestroy {

	moduleNames = Object.keys(modules);
	modules = modules;

	selectedModuleType = this.moduleNames[0];
	moduleOptions: Options = getDefaultOptions(this.selectedModuleType);
	// Dimensions of the module (in pixels)
	moduleWidth = 1000;
	moduleHeight = 500;

	moduleInteractable: Interact.Interactable;

	constructor() { }

	ngOnInit() {
		this.moduleInteractable = interact('.module-container-container')
			.resizable({
				autoScroll: true,
				edges: {
					right: '.resize-icon',
					bottom: '.resize-icon'
				}
			})
			.on('resizemove', event => {
				this.moduleWidth = event.rect.width;
				this.moduleHeight = event.rect.height;

				event.target.style.width = `${event.rect.width}px`;
				event.target.style.height = `${event.rect.height}px`;
			});
	}

	ngOnDestroy() {
		this.moduleInteractable.unset();
	}

	setDefaultOptions(type: string) {
		this.moduleOptions = getDefaultOptions(type);
	}

	updateOptions(options: Options) {
		// this.moduleOptions = JSON.parse(JSON.stringify(options));
	}

}
