import {Component} from '@angular/core';
import {NgFor} from '@angular/common';

@Component({
	selector: 'about',
	templateUrl: 'app/components/About/about.html',
	styleUrls: ['dist/app/components/About/about.css'],
	directives: [NgFor]
})
export class AboutComponent {
	developers:any[] = [
		{
			firstName: 'Michael',
			lastName : 'Gira',
			gradYear : 2019,
			title    : 'Creator and Lead Developer',
			image    : 'https://micds.myschoolapp.com/ftpimages/243/user/large_user_3213179.JPG'
		},
		{
			firstName: 'Nick',
			lastName : 'Clifford',
			gradYear : 2020,
			title    : 'System Administrations',
			image    : 'https://micds.myschoolapp.com/ftpimages/243/user/large_user_3251299.JPG'
		},
		{
			firstName: 'Jack',
			lastName : 'Cai',
			gradYear : 2019,
			title    : 'Front-End Developer',
			image    : 'https://micds.myschoolapp.com/ftpimages/243/user/large_user_3609440.JPG'
		},
		{
			firstName: 'Bob',
			lastName : 'Sforza',
			gradYear : 2017,
			title    : 'Developer',
			image    : 'https://micds.myschoolapp.com/ftpimages/243/user/large_user_3339113.JPG'
		}
	];
}
