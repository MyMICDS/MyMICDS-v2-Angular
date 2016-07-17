import {Component} from '@angular/core';
import {ProgressComponent} from './components/Progress/progress.component';

@Component({
	selector: 'home',
	templateUrl: 'app/components/Home/home.html',
	styleUrls: ['dist/app/components/Home/home.css'],
	directives: [ProgressComponent]
})
export class HomeComponent {}
