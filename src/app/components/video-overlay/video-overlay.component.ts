import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import * as seeThru from 'seethru';
import * as shuffle from 'lodash.shuffle';
import { Observable } from 'rxjs';

interface VideoData {
	url: string;
	loaded: boolean;
}

@Component({
	selector: 'mymicds-video-overlay',
	templateUrl: './video-overlay.component.html',
	styleUrls: ['./video-overlay.component.scss']
})
export class VideoOverlayComponent implements AfterViewInit {

	videos = [
		'/assets/video-overlays/Jack-Bagel.webm',
		'/assets/video-overlays/Test-OJ.webm',
		'/assets/video-overlays/Test-Jump.webm',
		'/assets/video-overlays/Logo-Draw.webm',
		'/assets/video-overlays/Kenny-Riding.webm',
		'/assets/video-overlays/Harry-Shades.webm',
		'/assets/video-overlays/Alexander-Ninja.webm',
		'/assets/video-overlays/Harry-Surfing-Alexander.webm'
	];

	// @ViewChildren('video') video: QueryList<ElementRef>;
	@ViewChild('video') video: ElementRef;
	seeThruVideo: HTMLVideoElement;
	shuffledVideoRotation: VideoData[] = this.videos.map(url => ({ url, loaded: false }));

	fallback = false;
	loading = true;
	setup = false;
	currentIndex = 0;
	currentVideo: string;

	ngAfterViewInit() {
		if (this.video.nativeElement.canPlayType('video/webm')) {
			// Queue loading of images
			console.log('webm video supported!', this.shuffledVideoRotation);

			for (const video of this.shuffledVideoRotation) {
				this.loadVideo(video.url).subscribe(bloblUrl => {
					console.log('loaded video', video.url, bloblUrl);
					video.loaded = true;
					if (!this.currentVideo) {
						this.playVideo(0);
					}
				});
			}


		} else {
			// Fallback to gif
			this.fallback = true;
		}

	}

	setupVideo() {
		console.log('call setup video func');
		this.setup = true;
		seeThru
			.create(this.video.nativeElement)
			.ready((instance, video, canvas) => {
				video.addEventListener('play', () => {
					this.loading = false;
				});
				video.addEventListener('ended', () => {
					this.loading = true;
					console.log('ended video');
					// instance.revert();
					setTimeout(() => {
						this.playVideo(++this.currentIndex % this.shuffledVideoRotation.length);
					}, 1000);
				});
			});
	}

	playVideo(i: number) {
		// Shuffle at the beginning of each rotation
		if (i === 0) {
			this.shuffledVideoRotation = shuffle(this.shuffledVideoRotation);
			console.log('reshuffle videos', this.shuffledVideoRotation);
		}

		const video = this.shuffledVideoRotation[i];

		if (!video.loaded) {
			console.log('no blob url. skipping!');
			this.currentIndex = ++i % this.shuffledVideoRotation.length;
			this.playVideo(this.currentIndex);
		} else {
			console.log('play video', video.url);
			this.video.nativeElement.src = video.url;

			if (!this.setup) {
				this.setupVideo();
			}
		}
	}

	loadVideo(url: string): Observable<string> {
		return new Observable(observer => {
			fetch(url)
				.then(response => {
					return response.blob();
				})
				.then(blob => {
					observer.next(URL.createObjectURL(blob));
					observer.complete();
				});
		});
	}

}
