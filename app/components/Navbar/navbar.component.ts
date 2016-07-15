import {Component} from '@angular/core';
import {ROUTER_DIRECTIVES} from '@angular/router';

@Component({
	selector: 'navbar',
	templateUrl: 'app/components/navbar/navbar.html',
	styleUrls: ['dist/app/components/navbar/navbar.css'],
	directives: [ROUTER_DIRECTIVES],
})
export class NavbarComponent {

}
