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
	}

}
