import { Component, OnInit } from '@angular/core';
import * as interact from 'interactjs';

import { modules } from '../modules/modules-main';

@Component({
	selector: 'mymicds-module-inspector',
	templateUrl: './module-inspector.component.html',
	styleUrls: ['./module-inspector.component.scss']
})
export class ModuleInspectorComponent implements OnInit {

	moduleNames = Object.keys(modules);
	modules = modules;

	selectedModule = this.moduleNames[0];

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
				event.target.style.width = `${event.rect.width}px`;
				event.target.style.height = `${event.rect.height}px`;
			});
	}

}
