import { Component, OnInit, Input, OnChanges } from '@angular/core';

@Component({
	selector: 'mymicds-setting-container',
	templateUrl: './setting-container.component.html',
	styleUrls: ['./setting-container.component.scss']
})
export class SettingContainerComponent implements OnInit, OnChanges {

	@Input() value: any;

	constructor() { }

	ngOnInit() {
		console.log('init', this.value);
	}

	ngOnChanges() {
		console.log('changes', this.value);
	}

}
