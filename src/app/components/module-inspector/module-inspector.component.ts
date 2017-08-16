import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import * as interact from 'interactjs';

import { config, getDefaultOptions } from '../modules/module-config';
import { Options } from '../modules/module-options';

@Component({
	selector: 'mymicds-module-inspector',
	templateUrl: './module-inspector.component.html',
	styleUrls: ['./module-inspector.component.scss']
})
export class ModuleInspectorComponent implements OnInit, OnDestroy {

	moduleNames = Object.keys(config);
	modules = config;

	get selectedModuleType() {
		return this._selectedModuleType;
	}
	set selectedModuleType(value: string) {
		this._selectedModuleType = value;
		this.updateURL();
	}
	private _selectedModuleType = this.moduleNames[0];

	moduleOptions: Options = getDefaultOptions(this.selectedModuleType);

	// Dimensions of the module (in pixels)
	get moduleWidth() {
		return this._moduleWidth;
	}
	set moduleWidth(value: number) {
		this._moduleWidth = value;
		this.updateURL();
	}
	private _moduleWidth = 1000;

	get moduleHeight() {
		return this._moduleHeight;
	}
	set moduleHeight(value: number) {
		this._moduleHeight = value;
		this.updateURL();
	}
	private _moduleHeight = 500;

	private updateURLTimeout: NodeJS.Timer;

	moduleInteractable: Interact.Interactable;

	constructor(private router: Router, private route: ActivatedRoute) { }

	ngOnInit() {

		// See if there's URL parameters
		const params = this.route.snapshot.queryParams;
		if (params.type) {
			this.selectedModuleType = params.type;
		}
		if (params.width) {
			this.moduleWidth = params.width;
		}
		if (params.height) {
			this.moduleHeight = params.height;
		}

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

	private updateURL() {
		// Add timeout so inspector doesn't lag out when resizing
		clearTimeout(this.updateURLTimeout);
		this.updateURLTimeout = setTimeout(() => {
			this.router.navigate(['/module-inspector'], {
				queryParams: {
					type: this.selectedModuleType,
					width: this.moduleWidth,
					height: this.moduleHeight
				}
			});
		}, 500);
	}

}
