import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import * as seeThru from 'seethru';

@Component({
	selector: 'mymicds-video-overlay',
	templateUrl: './video-overlay.component.html',
	styleUrls: ['./video-overlay.component.scss']
})
export class VideoOverlayComponent implements OnInit {

	@ViewChild('video') video: ElementRef;

	constructor() { }

	ngOnInit() {
		seeThru.create(this.video.nativeElement);
	}

}
