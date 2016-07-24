import {Component} from '@angular/core';
import {ROUTER_DIRECTIVES, Router, NavigationStart} from '@angular/router';

import {AuthService} from '../../services/auth.service' //import auth service to listen for the login event
import {UserService} from '../../services/user.service' //import user service to get username
import {Title} from '@angular/platform-browser'

@Component({
	selector: 'navbar',
	templateUrl: 'app/components/Navbar/navbar.html',
	styleUrls: ['dist/app/components/Navbar/navbar.css'],
	directives: [ROUTER_DIRECTIVES],
})
export class NavbarComponent {
	constructor (private authService: AuthService, private userService: UserService, private titleService: Title, private router: Router) {
		this.authService.loginEvent$.subscribe( //listens to the login event and set the username
			state => {
				if (state) {
					this.userName = this.userService.getUsername();
				} else {
					this.userName = undefined
				}
			}
		)
	}

	CFL(str:string) {//capitalize first letter
		return str.charAt(0).toUpperCase() + str.slice(1);
	}

	ngOnInit() {
		this.userName = this.userService.getUsername();
		this.titleService.setTitle('MyMICDS-Home'); //default set page title to home
		this.router.events.subscribe(event => {//listens to page navigation event, and set the corresponding page title
            if(event instanceof NavigationStart) {
                this.titleService.setTitle('MyMCIDS-'+this.CFL(event.url.substr(1)));
            }
        });
	}

	public userName: string
}