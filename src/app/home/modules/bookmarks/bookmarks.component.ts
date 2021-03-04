import { Component, OnInit, Input } from '@angular/core';
import { fas } from '@fortawesome/free-solid-svg-icons';

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
		const isOutlineIcon = this.icon.substring(this.icon.length - 2, this.icon.length) == '-o'
		if (this.icon.includes('fa-')) { // If it's an outline icon from FA4 (fa-envelope-o), remove the 'fa' and 'o'
			this.icon = this.icon.substring(3)

			if (isOutlineIcon) {
				this.icon = this.icon.substring(0, this.icon.length - 2)
			}
			
			let iconExists = false; // check that the icon currently exists in the Icon pack
			for (const icon in fas) {
				if (this.icon == fas[icon].iconName) {
					iconExists = true;
					break
				}
			}

			if (!iconExists) { // if not, use the default 'bookmark'
				this.icon = 'bookmark'
			}

		}
	}

}
