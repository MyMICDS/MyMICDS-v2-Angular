import {Component} from '@angular/core';
import {ROUTER_DIRECTIVES} from '@angular/router';

import {NavbarComponent} from './components/Navbar/navbar.component';
import {HomeComponent} from './components/Home/home.component';
import {LunchComponent} from './components/Lunch/lunch.component';

@Component({
	selector: 'mymicds-app',
	template: `
		<navbar></navbar>
		<router-outlet></router-outlet>
	`,
	directives: [NavbarComponent, ROUTER_DIRECTIVES],
	precompile: [NavbarComponent, HomeComponent, LunchComponent]
})
export class AppComponent {

}
