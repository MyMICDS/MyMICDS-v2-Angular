import {Component} from '@angular/core';
import {NgFor} from '@angular/common';

import {BlurDirective} from '../../directives/blur.directive';

@Component({
	selector: 'about',
	templateUrl: 'app/components/About/about.html',
	styleUrls: ['dist/app/components/About/about.css'],
	directives: [NgFor, BlurDirective]
})
export class AboutComponent {
	developers:any[] = [
		{
			firstName: 'Michael',
			lastName : 'Gira',
			gradYear : 2019,
			title    : 'Creator and Lead Developer',
			image    : 'dist/app/resources/developers/michaels-ugly-face.jpg'
		},
		{
			firstName: 'Nick',
			lastName : 'Clifford',
			gradYear : 2020,
			title    : 'System Administrations',
			image    : 'dist/app/resources/developers/nicks-ugly-face.jpg'
		},
		{
			firstName: 'Jack',
			lastName : 'Cai',
			gradYear : 2019,
			title    : 'Front-End Developer',
			image    : 'dist/app/resources/developers/jacks-ugly-face.jpg'
		},
		{
			firstName: 'Bob',
			lastName : 'Sforza',
			gradYear : 2017,
			title    : 'Developer',
			image    : 'dist/app/resources/developers/bobs-ugly-face.jpg'
		}
	];
}
