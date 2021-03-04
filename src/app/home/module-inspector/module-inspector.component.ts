import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { config, getDefaultOptions } from '../modules/module-config';
import { Options } from '../modules/module-options';
import interact from 'interactjs';

@Component({
	selector: 'mymicds-module-inspector',
	templateUrl: './module-inspector.component.html',
	styleUrls: ['./module-inspector.component.scss']
})
export class ModuleInspectorComponent implements OnInit, OnDestroy {

	private _moduleWidth = 1000;
	private _moduleHeight = 500;
	private _fixedHeight = true;

	private updateURLTimeout: NodeJS.Timer;

	moduleNames = Object.keys(config);
	modules = config;

	moduleOptions: Options = getDefaultOptions(this.selectedModuleType);

	moduleInteractable: Interact.Interactable;

	// eslint-disable-next-line @typescript-eslint/member-ordering
	private _selectedModuleType = this.moduleNames[0];

	get selectedModuleType() {
		return this._selectedModuleType;
	}
	set selectedModuleType(value: string) {
		this._selectedModuleType = value;
		this.updateURL();
	}

	// Dimensions of the module (in pixels)
	get moduleWidth() {
		return this._moduleWidth;
	}
	set moduleWidth(value: number) {
		this._moduleWidth = value;
		this.updateURL();
	}

	get moduleHeight() {
		return this._moduleHeight;
	}
	set moduleHeight(value: number) {
		this._moduleHeight = value;
		this.updateURL();
	}

	get fixedHeight() {
		return this._fixedHeight;
	}
	set fixedHeight(value: boolean) {
		this._fixedHeight = value;
		this.updateURL();
	}

	constructor(private router: Router, private route: ActivatedRoute) {}

	private updateURL() {
		// Add timeout so inspector doesn't lag out when resizing
		clearTimeout(this.updateURLTimeout);
		this.updateURLTimeout = setTimeout(() => {
			void this.router.navigate(['/home/module-inspector'], {
				queryParams: {
					type: this.selectedModuleType,
					width: this.moduleWidth,
					height: this.moduleHeight,
					fixedHeight: this.fixedHeight
				}
			});
		}, 500);
	}

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
		if (params.fixedHeight) {
			this.fixedHeight = params.fixedHeight;
		}

		this.moduleInteractable = interact('.module-container-container')
			.resizable({
				autoScroll: true,
				edges: {
					right: '.resize-icon',
					bottom: '.resize-icon'
				}
			})
			.on('resizemove', (event: Interact.ResizeEvent) => {
				this.moduleWidth = event.rect.width;
				this.moduleHeight = event.rect.height;

				event.target.style.width = `${event.rect.width}px`;

				if (event.target.classList.contains('fixed-height')) {
					event.target.style.height = `${event.rect.height}px`;
				}
			});
	}

	ngOnDestroy() {
		this.moduleInteractable.unset();
	}

	setDefaultOptions(type: string) {
		this.moduleOptions = getDefaultOptions(type);
	}

	updateOptions(options: Options) {
		this.moduleOptions = JSON.parse(JSON.stringify(options));
	}
}
