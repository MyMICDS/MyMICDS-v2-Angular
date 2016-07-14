import {Component} from '@angular/core';
import {ROUTER_DIRECTIVES} from '@angular/router';

import {HomeComponent} from './components/Home/home.component';
import {LunchComponent} from './components/Lunch/lunch.component';

@Component({
	selector: 'mymicds-app',
	template: `
		<h1>Hello World!</h1>
		<a [routerLink]="['/home']">Home</a>
		<a [routerLink]="['/lunch']">Lunch</a>
		<router-outlet></router-outlet>
	`,
	directives: [ROUTER_DIRECTIVES],
	precompile: [HomeComponent, LunchComponent]
})
export class AppComponent {

}
