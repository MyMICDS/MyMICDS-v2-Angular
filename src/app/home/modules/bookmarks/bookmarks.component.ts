import { Component, Input, OnInit } from '@angular/core';
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

	ngOnInit() {
		// Check for legacy FA4 icons
		if (this.icon.includes('fa-')) {
			// Remove 'fa-' prefix
			this.icon = this.icon.substring(3);

			// Remove '-o' suffix if icon contains it
			if (this.icon.substring(this.icon.length - 2, this.icon.length) === '-o') {
				this.icon = this.icon.substring(0, this.icon.length - 2);
			}

			// If there's no matching FA5 icon, use 'bookmark' as a fallback
			if (!Object.values(fas).some(i => this.icon === i.iconName)) {
				this.icon = 'bookmark';
			}
		}
	}
}
