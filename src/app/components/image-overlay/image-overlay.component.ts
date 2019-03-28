import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import * as shuffle from 'lodash.shuffle';

import { loadImage } from '../../common/utils';

interface ImageData {
	url: string;
	duration: number;
	loaded: boolean;
}

const imageRotation: ImageData[] = [
	{
		url: '/assets/gif-overlays/jack-bagel.gif',
		duration: 7720,
		loaded: false
	},
	{
		url: '/assets/gif-overlays/test-oj.gif',
		duration: 4920,
		loaded: false
	},
	{
		url: '/assets/gif-overlays/test-jump.gif',
		duration: 4560,
		loaded: false
	}
	// {
	// 	url: '/assets/gif-overlays/progress.gif',
	// 	duration: 5000,
	// 	loaded: false
	// },
	// {
	// 	url: '/assets/gif-overlays/vroom.gif',
	// 	duration: 7000,
	// 	loaded: false
	// }
];

@Component({
	selector: 'mymicds-image-overlay',
	templateUrl: './image-overlay.component.html',
	styleUrls: ['./image-overlay.component.scss']
})
export class ImageOverlayComponent implements OnInit, OnDestroy {

	shuffledImageRotation: ImageData[] = imageRotation;

	@ViewChild('imageContainer') imageContainer: ElementRef;

	displayImage: string = '';
	imageTimeout: NodeJS.Timer;

	ngOnInit() {
		// Queue loading of images
		for (const image of this.shuffledImageRotation) {
			loadImage(image.url).subscribe(() => {
				image.loaded = true;
				if (!this.imageTimeout) {
					this.playImage(0);
				}
			});
		}
	}

	ngOnDestroy() {
		if (this.imageTimeout) {
			clearTimeout(this.imageTimeout);
		}
	}

	playImage(i: number) {
		// Shuffle at the beginning of each rotation
		if (i === 0) {
			console.log('reshuffle images');
			this.shuffledImageRotation = shuffle(imageRotation);
		}

		const image = this.shuffledImageRotation[i];

		if (!image.loaded) {
			this.playImage(++i % this.shuffledImageRotation.length);
		} else {
			console.log('play image', image.url);
			this.displayImage = image.url;
			this.imageTimeout = setTimeout(() => {
				this.playImage(++i % this.shuffledImageRotation.length);
			}, image.duration);
		}
	}

	shuffleRotation() {
		this.shuffledImageRotation = shuffle(this.shuffledImageRotation);
	}

}
