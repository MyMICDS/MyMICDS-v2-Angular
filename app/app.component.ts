import {Component} from '@angular/core';
import {ROUTER_DIRECTIVES} from '@angular/router';
import {HTTP_PROVIDERS} from '@angular/http';

import {NavbarComponent} from './components/Navbar/navbar.component';
import {HomeComponent} from './components/Home/home.component';
import {LunchComponent} from './components/Lunch/lunch.component';
import {LoginComponent} from './components/Login/login.component'
import {RegisterComponent} from './components/Register/register.component' 

@Component({
	selector: 'mymicds-app',
	template: `
		<navbar></navbar>
		<router-outlet></router-outlet>
	`,
	providers: [HTTP_PROVIDERS],
	directives: [NavbarComponent, ROUTER_DIRECTIVES],
	precompile: [NavbarComponent, HomeComponent, LunchComponent, LoginComponent, RegisterComponent]
})
export class AppComponent {

}
