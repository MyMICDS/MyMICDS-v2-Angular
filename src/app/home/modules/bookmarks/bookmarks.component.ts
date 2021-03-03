import { Component, OnInit, Input } from '@angular/core';

@Component({
	selector: 'mymicds-bookmarks',
	templateUrl: './bookmarks.component.html',
	styleUrls: ['./bookmarks.component.scss']
})
export class BookmarksComponent implements OnInit {

	@Input() label: string;
	@Input() icon: string;
	@Input() url: string;

	constructor() { }

	ngOnInit() {
		if (this.icon.includes('fa-')) { // FIX for people who still have FA 4 icons in their settings
			this.icon = 'bookmark'
		}
	}

}
