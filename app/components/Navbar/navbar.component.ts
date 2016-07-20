import {Component} from '@angular/core';
import {ROUTER_DIRECTIVES} from '@angular/router';

import {LocalStorageService} from '../../services/localStorage.service'
import {Title} from '@angular/platform-browser'

@Component({
	selector: 'navbar',
	templateUrl: 'app/components/Navbar/navbar.html',
	styleUrls: ['dist/app/components/Navbar/navbar.css'],
	directives: [ROUTER_DIRECTIVES],
})
export class NavbarComponent {
	constructor (private localStorage: LocalStorageService, private titleService: Title) {
		this.userName = this.localStorage.getItem('user');
		this.localStorage.setItem$.subscribe(item => {
			if (item.index === 'user') {this.userName = item.value;}
		});
		this.localStorage.removeItem$.subscribe(item => {
			this.userName = undefined;
		})
	}

	changeTitle(route:string) {
		this.titleService.setTitle('MyMCIDS-'+route);
	}

	ngOnInit() {
		this.titleService.setTitle('MyMCIDS-Home');
	}

	public userName: string
}
