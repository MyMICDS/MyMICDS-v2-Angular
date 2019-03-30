import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import * as shuffle from 'lodash.shuffle';

import { loadImage } from '../../common/utils';

interface VideoData {
	url: string;
	loaded: boolean;
}

const videos = [
	'/assets/gif-overlays/Test-OJ.mp4'
];

@Component({
	selector: 'mymicds-alpha-video',
	templateUrl: './alpha-video.component.html',
	styleUrls: ['./alpha-video.component.scss']
})
export class AlphaVideoComponent implements OnInit, OnDestroy {

	// shuffledVideoRotation: VideoData[] = videos.map(url => ({ url, loaded: false }));

	@ViewChild('output') outputCanvas: ElementRef;
	@ViewChild('buffer') bufferCanvas: ElementRef;
	@ViewChild('video') video: ElementRef;

	output: any;
	buffer: any;

	// width = outputCanvas.width,
	// height = outputCanvas.height,
	// interval;

	ngOnInit() {
		// Queue loading of images
		// for (const image of this.shuffledVideoRotation) {
		// 	loadImage(image.url).subscribe(() => {
		// 		image.loaded = true;
		// 		// if (!this.imageTimeout) {
		// 		// 	this.playImage(0);
		// 		// }
		// 	});
		// }
		this.output = this.outputCanvas.nativeElement.getContext('2d');
		this.buffer = this.bufferCanvas.nativeElement.getContext('2d');
		this.processFrame();
	}

	ngOnDestroy() {
		// if (this.imageTimeout) {
		// 	clearTimeout(this.imageTimeout);
		// }
	}

	playImage(i: number) {
		// Shuffle at the beginning of each rotation
		// if (i === 0) {
		// 	console.log('reshuffle images');
		// 	this.shuffledVideoRotation = shuffle(this.shuffledVideoRotation);
		// }

		// const image = this.shuffledImageRotation[i];
		//
		// if (!image.loaded) {
		// 	this.playImage(++i % this.shuffledImageRotation.length);
		// } else {
		// 	console.log('play image', image.url);
		// 	this.displayImage = image.url;
		// 	this.imageTimeout = setTimeout(() => {
		// 		this.playImage(++i % this.shuffledImageRotation.length);
		// 	}, image.duration);
		// }
	}

	processFrame() {
		// const { width, height } = this.outputCanvas.nativeElement;
		const width = 1280;
		const height = 720;
		this.buffer.drawImage(this.video.nativeElement, 0, 0);

		// this can be done without alphaData, except in Firefox which doesn't like it when image is bigger than the canvas
		const image = this.buffer.getImageData(0, 0, width, height);
		const imageData = image.data;
		const alphaData = this.buffer.getImageData(0, height, width, height).data;

		for (var i = 3, len = imageData.length; i < len; i = i + 4) {
			imageData[i] = alphaData[i-1];
		}

		this.output.putImageData(image, 0, 0, 0, 0, width, height);

		requestAnimationFrame(() => this.processFrame());
		// setTimeout(() => this.processFrame(), 10);
	}

}
