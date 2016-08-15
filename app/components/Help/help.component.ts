import {Component} from '@angular/core';
import {ROUTER_DIRECTIVES} from '@angular/router';
import {FaComponent} from 'angular2-fontawesome/components';

import {BlurDirective} from '../../directives/blur.directive';

@Component({
	selector: 'about',
	templateUrl: 'app/components/Help/help.html',
	styleUrls: ['dist/app/components/Help/help.css'],
	directives: [ROUTER_DIRECTIVES, BlurDirective, FaComponent]
})
export class HelpComponent {}
