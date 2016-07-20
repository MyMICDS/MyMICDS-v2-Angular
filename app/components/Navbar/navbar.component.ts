import {Component} from '@angular/core';
import {ROUTER_DIRECTIVES, Router, NavigationStart} from '@angular/router';

import {LocalStorageService} from '../../services/localStorage.service'
import {Title} from '@angular/platform-browser'

@Component({
	selector: 'navbar',
	templateUrl: 'app/components/Navbar/navbar.html',
	styleUrls: ['dist/app/components/Navbar/navbar.css'],
	directives: [ROUTER_DIRECTIVES],
})
export class NavbarComponent {
	constructor (private localStorage: LocalStorageService, private titleService: Title, private router: Router) {
		this.userName = this.localStorage.getItem('user');
		this.localStorage.setItem$.subscribe(item => {
			if (item.index === 'user') {this.userName = item.value;}
		});
		this.localStorage.removeItem$.subscribe(item => {
			this.userName = undefined;
		})
	}

	CFL(str:string) {
		return str.charAt(0).toUpperCase() + str.slice(1);
	}

	ngOnInit() {
		this.titleService.setTitle('MyMICDS-Home');
		this.router.events.subscribe(event => {
            if(event instanceof NavigationStart) {
                this.titleService.setTitle('MyMCIDS-'+this.CFL(event.url.substr(1)));
            }
        });
	}

	public userName: string
}