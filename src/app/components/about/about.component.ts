import { Component } from '@angular/core';

@Component({
	selector: 'mymicds-about',
	templateUrl: './about.component.html',
	styleUrls: ['./about.component.scss']
})
export class AboutComponent {

	developers: any[] = [
		{
			firstName: 'Michael',
			lastName : 'Gira',
			gradYear : 2019,
			title    : 'Creator and Lead Developer',
			image    : 'assets/developers/michaels-ugly-face-new.jpg'
		},
		{
			firstName: 'Nick',
			lastName : 'Clifford',
			gradYear : 2020,
			title    : 'System Administrations',
			image    : 'assets/developers/nicks-ugly-face-new.jpg'
		},
		{
			firstName: 'Jack',
			lastName : 'Cai',
			gradYear : 2019,
			title    : 'Front-End Developer',
			image    : 'assets/developers/jacks-ugly-face-new.jpg'
		},
		{
			firstName: 'Bob',
			lastName : 'Sforza',
			gradYear : 2017,
			title    : 'Developer',
			image    : 'assets/developers/bobs-ugly-face-new.jpg'
		},
		{
			firstName: 'Alex',
			lastName : 'Migala',
			gradYear : 2020,
			title    : 'Junior Developer',
			image    : 'assets/developers/alexs-ugly-face.jpg'
		}
	];

}
