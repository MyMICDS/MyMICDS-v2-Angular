import { Component } from '@angular/core';
import { IImage } from 'ng-simple-slideshow';

@Component({
	selector: 'mymicds-campus',
	templateUrl: './campus.component.html',
	styleUrls: ['./campus.component.scss']
})
export class CampusComponent {
	imageUrls: IImage[] = [
		{
			url:
				'https://static.wixstatic.com/media/2ef4cb_0f3f8793dfa1468c9893dd6d86795d27~mv2_d_4032_3024_s_4_2.jpg/v1/fill/w_740,h_555,al_c,q_90,usm_0.66_1.00_0.01/2ef4cb_0f3f8793dfa1468c9893dd6d86795d27~mv2_d_4032_3024_s_4_2.webp',
			caption: 'MICDS Best Buddies Goes Bowling!',
			href: 'https://micdscsc.wixsite.com/opportunities/post/micds-best-buddies-goes-bowling'
		},
		{
			url:
				'https://static.wixstatic.com/media/2ef4cb_56cbdb743abe4f3db18cf3dc0429e893~mv2.jpg/v1/fill/w_826,h_582,al_c,q_90/2ef4cb_56cbdb743abe4f3db18cf3dc0429e893~mv2.jpg',
			caption: 'Best Buddies Celebrate Thanksgiving',
			href: 'https://micdscsc.wixsite.com/opportunities/post/best-buddies-hosts-buddysgiving'
		},
		{
			url:
				'https://static.wixstatic.com/media/a27d24_1feaedbc518241f89569cae7084271e5~mv2_d_2999_1999_s_2.jpg/v1/fill/w_2999,h_1999,al_c,q_90/a27d24_1feaedbc518241f89569cae7084271e5~mv2_d_2999_1999_s_2.webp',
			caption: 'Girls On The Run',
			href:
				'https://micdscsc.wixsite.com/opportunities/post/members-of-girls-xc-team-volunteer-for-girls-on-the-run-5k'
		},
		{
			url:
				'https://static.wixstatic.com/media/2ef4cb_9115c1dea15943368349fbdb2ca13923~mv2_d_1600_1200_s_2.jpg/v1/fill/w_1600,h_1200,al_c,q_90/2ef4cb_9115c1dea15943368349fbdb2ca13923~mv2_d_1600_1200_s_2.webp',
			caption: 'Operation Gratitude',
			href:
				'https://micdscsc.wixsite.com/opportunities/post/micds-supports-operation-gratitude-donate-extra-candy-to-the-troops'
		},
		{
			url:
				'https://static.wixstatic.com/media/2ef4cb_2a61a83c56fd40ea8931c34c0b7c16e0~mv2.jpg/v1/fill/w_1024,h_768,al_c,q_90/2ef4cb_2a61a83c56fd40ea8931c34c0b7c16e0~mv2.webp',
			caption: 'BJC Hospice',
			href:
				'https://micdscsc.wixsite.com/opportunities/post/top-5-items-under-20-i-can-not-live-without'
		},
		{
			url:
				'https://static.wixstatic.com/media/2ef4cb_1d23117fbeb046eeaa49251b900707db~mv2.jpg/v1/fill/w_5184,h_3456,al_c,q_90/2ef4cb_1d23117fbeb046eeaa49251b900707db~mv2.webp',
			caption: 'CARE Socializes Foster Puppies',
			href: 'https://micdscsc.wixsite.com/opportunities/post/5-pizza-places-you-must-know'
		}
	];

	// While some of these options are not used in the element, it is used elsewhere
	height = '500px';
	autoPlay = true;
	autoPlayInterval = 3333;
	showDots = true;
	dotColor = '#FFF';
	showCaptions = true;
	captionColor = '#FFF';
	noLoop = false;
}
