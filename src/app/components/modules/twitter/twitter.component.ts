import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import * as ResizeSensor from 'css-element-queries/src/ResizeSensor';

@Component({
	selector: 'mymicds-twitter',
	templateUrl: './twitter.component.html',
	styleUrls: ['./twitter.component.scss']
})
export class TwitterComponent implements OnInit {

	@Input() fixedHeight: boolean;

	get moduleHeight(): number {
		if (this.fixedHeight) {
			return this.moduleContainer.nativeElement.clientHeight;
		} else {
			return 420;
		}
	}

	@ViewChild('moduleContainer') moduleContainer: ElementRef;

	constructor() { }

	ngOnInit() {
		this.loadTwitter();
		(window as any).twttr.ready(() => {
			this.createTwitter();

			let resizeTimeout = null;
			new ResizeSensor(this.moduleContainer.nativeElement, () => {
				clearTimeout(resizeTimeout);
				if (this.fixedHeight) {
					resizeTimeout = setTimeout(() => {
						this.deleteTwitter();
						this.createTwitter();
					}, 1000);
				}
			});
		});
	}

	private createTwitter(height: number = this.moduleHeight) {
		(window as any).twttr.widgets.createTimeline(
			{
				sourceType: 'list',
				ownerScreenName: 'MyMICDS',
				slug: 'mymicds-module-feed'
			},
			this.moduleContainer.nativeElement,
			{
				height,
				chrome: 'nofooter',
				theme: 'dark'
			}
		);
	}

	private deleteTwitter() {
		const container = this.moduleContainer.nativeElement;
		for (const child of container.children) {
			if (!child.classList.contains('resize-sensor')) {
				container.removeChild(child);
			}
		}
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