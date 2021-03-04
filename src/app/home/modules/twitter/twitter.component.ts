import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import ResizeSensor from 'css-element-queries/src/ResizeSensor';

declare global {
	interface Window {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		twttr: any;
	}
}

@Component({
	selector: 'mymicds-twitter',
	templateUrl: './twitter.component.html',
	styleUrls: ['./twitter.component.scss']
})
export class TwitterComponent implements OnInit {
	@Input() fixedHeight: boolean;

	@ViewChild('moduleContainer', { static: true }) moduleContainer: ElementRef<HTMLElement>;
	resizeSensor: ResizeSensor;

	get moduleHeight(): number {
		if (this.fixedHeight) {
			return this.moduleContainer.nativeElement.clientHeight;
		}
		return 420;
	}

	private createTwitter(height: number = this.moduleHeight) {
		window.twttr.widgets.createTimeline(
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
		for (const child of Array.from(container.children)) {
			if (!child.classList.contains('resize-sensor')) {
				container.removeChild(child);
			}
		}
	}

	private loadTwitter() {
		/* eslint-disable */
		window.twttr = (function (d, s, id) {
			let js: HTMLScriptElement;
			const fjs = d.getElementsByTagName(s)[0];
			const t = window.twttr || {};
			if (d.getElementById(id)) {
				return t;
			}
			js = d.createElement(s) as HTMLScriptElement;
			js.id = id;
			js.src = 'https://platform.twitter.com/widgets.js';
			fjs.parentNode!.insertBefore(js, fjs);

			t._e = [];
			t.ready = function (f: any) {
				t._e.push(f);
			};

			return t;
		})(document, 'script', 'twitter-wjs');
		/* eslint-enable */
	}

	ngOnInit() {
		this.loadTwitter();
		window.twttr.ready(() => {
			this.createTwitter();

			let resizeTimeout: NodeJS.Timeout | null = null;
			this.resizeSensor = new ResizeSensor(this.moduleContainer.nativeElement, () => {
				if (resizeTimeout) {
					clearTimeout(resizeTimeout);
				}
				if (this.fixedHeight) {
					resizeTimeout = setTimeout(() => {
						this.deleteTwitter();
						this.createTwitter();
					}, 1000);
				}
			});
		});
	}
}
