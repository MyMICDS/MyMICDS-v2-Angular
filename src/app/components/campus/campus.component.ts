import { MyMICDS, JWT } from '@mymicds/sdk';

import { Component, OnInit, NgZone } from '@angular/core';
import { Router } from '@angular/router';

import { SubscriptionsComponent } from '../../common/subscriptions-component';

@Component({
	selector: 'mymicds-campus',
	templateUrl: './campus.component.html',
	styleUrls: ['./campus.component.scss']
})
export class CampusComponent extends SubscriptionsComponent implements OnInit {
	imageUrls: (string)[] = [
	    'https://static.wixstatic.com/media/2ef4cb_56cbdb743abe4f3db18cf3dc0429e893~mv2.jpg/v1/fill/w_826,h_582,al_c,q_90/2ef4cb_56cbdb743abe4f3db18cf3dc0429e893~mv2.jpg',
	    'https://static.wixstatic.com/media/a27d24_1feaedbc518241f89569cae7084271e5~mv2_d_2999_1999_s_2.jpg/v1/fill/w_2999,h_1999,al_c,q_90/a27d24_1feaedbc518241f89569cae7084271e5~mv2_d_2999_1999_s_2.webp',
	    'https://static.wixstatic.com/media/2ef4cb_9115c1dea15943368349fbdb2ca13923~mv2_d_1600_1200_s_2.jpg/v1/fill/w_1600,h_1200,al_c,q_90/2ef4cb_9115c1dea15943368349fbdb2ca13923~mv2_d_1600_1200_s_2.webp',
	    'https://static.wixstatic.com/media/2ef4cb_2a61a83c56fd40ea8931c34c0b7c16e0~mv2.jpg/v1/fill/w_1024,h_768,al_c,q_90/2ef4cb_2a61a83c56fd40ea8931c34c0b7c16e0~mv2.webp',
	    'https://static.wixstatic.com/media/2ef4cb_1d23117fbeb046eeaa49251b900707db~mv2.jpg/v1/fill/w_5184,h_3456,al_c,q_90/2ef4cb_1d23117fbeb046eeaa49251b900707db~mv2.webp'
	];
	ngOnInit() {}

	height: string = '400px';
	minHeight: string;
	arrowSize: string = '30px';
	showArrows: boolean = true;
	disableSwiping: boolean = false;
	autoPlay: boolean = true;
	autoPlayInterval: number = 3333;
	stopAutoPlayOnSlide: boolean = true;
	debug: boolean = false;
	backgroundSize: string = 'cover';
	backgroundPosition: string = 'center center';
	backgroundRepeat: string = 'no-repeat';
	showDots: boolean = true;
	dotColor: string = '#FFF';
	showCaptions: boolean = true;
	captionColor: string = '#FFF';
	captionBackground: string = 'rgba(0, 0, 0, .35)';
	lazyLoad: boolean = false;
	hideOnNoSlides: boolean = false;
	width: string = '100%';
	fullscreen: boolean = false;
	enableZoom: boolean = false;
	enablePan: boolean = false;
	noLoop: boolean = false;

	testEvent(event) {
		console.log(typeof event);
		console.log(event);
	}
}
