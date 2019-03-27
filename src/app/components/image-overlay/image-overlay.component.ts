import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import * as shuffle from 'lodash.shuffle';

import { loadImage } from '../../common/utils';

@Component({
	selector: 'mymicds-image-overlay',
	templateUrl: './image-overlay.component.html',
	styleUrls: ['./image-overlay.component.scss']
})
export class ImageOverlayComponent implements OnInit, OnDestroy {

	imageRotation: { url: string, duration: number, loaded: boolean }[] = [
		{
			url: '/assets/gif-overlays/jack-bagel.gif',
			duration: 5000,
			loaded: false
		// },
		// {
		// 	url: 'http://www.downgraf.com/wp-content/uploads/2014/09/01-progress.gif',
		// 	duration: 5000,
		// 	loaded: false
		// },
		// {
		// 	url: 'https://media3.giphy.com/media/Y5DLjUZysisyA/giphy.gif',
		// 	duration: 5000,
		// 	loaded: false
		}
	];

	@ViewChild('imageContainer') imageContainer: ElementRef;

	displayImage: string = '';
	imageTimeout: NodeJS.Timer;

	ngOnInit() {
		// Queue loading of images
		for (const image of this.imageRotation) {
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
			this.imageRotation = shuffle(this.imageRotation);
		}

		console.log('play iamge', this.imageRotation[i].url);
		const image = this.imageRotation[i];

		if (!image.loaded) {
			this.playImage(++i % this.imageRotation.length);
		} else {
			this.displayImage = image.url;
			this.imageTimeout = setTimeout(() => {
				this.playImage(++i % this.imageRotation.length);
			}, image.duration);
		}
	}

	shuffleRotation() {
		this.imageRotation = shuffle(this.imageRotation);
	}

}
