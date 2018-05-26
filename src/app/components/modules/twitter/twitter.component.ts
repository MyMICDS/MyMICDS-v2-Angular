import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

@Component({
	selector: 'mymicds-twitter',
	templateUrl: './twitter.component.html',
	styleUrls: ['./twitter.component.scss']
})
export class TwitterComponent implements OnInit {

	@ViewChild('moduleContainer') moduleContainer: ElementRef;

	constructor() { }

	ngOnInit() {
		this.loadTwitter();
		(window as any).twttr.ready(() => {
			(window as any).twttr.widgets.load(this.moduleContainer.nativeElement);
		});
	}

	private loadTwitter() {
		(window as any).twttr = (function(d, s, id) {
			let js, fjs = d.getElementsByTagName(s)[0],
				t = (window as any).twttr || {};
			if (d.getElementById(id)) { return t; }
			js = d.createElement(s);
			js.id = id;
			js.src = 'https://platform.twitter.com/widgets.js';
			fjs.parentNode.insertBefore(js, fjs);

			t._e = [];
			t.ready = function(f) {
				t._e.push(f);
			};

			return t;
		}(document, 'script', 'twitter-wjs'));
	}

}
