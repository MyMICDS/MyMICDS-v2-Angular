import {Component} from '@angular/core';
import {CORE_DIRECTIVES, FORM_DIRECTIVES, NgClass} from '@angular/common';
import {CHART_DIRECTIVES} from 'ng2-charts/ng2-charts';

@Component({
	selector: 'home',
	templateUrl: 'app/components/Home/home.html',
	styleUrls: ['dist/app/components/Home/home.css'],
	directives: [CHART_DIRECTIVES, NgClass, CORE_DIRECTIVES, FORM_DIRECTIVES]
})
export class HomeComponent {
	// Doughnut
	public doughnutChartLabels:string[] = ['Download Sales', 'In-Store Sales', 'Mail-Order Sales'];
	public doughnutChartData:number[] = [350, 450, 101];
	public doughnutChartType:string = 'doughnut';

	// events
	public chartClicked(e:any):void {
		console.log(e);
	}

	public chartHovered(e:any):void {
		console.log(e);
	}
}
