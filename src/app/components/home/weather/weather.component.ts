import { Component, OnInit, OnDestroy } from '@angular/core';

import { AlertService } from '../../../services/alert.service';
import { WeatherService } from '../../../services/weather.service';

@Component({
	selector: 'mymicds-weather',
	templateUrl: './weather.component.html',
	styleUrls: ['./weather.component.scss']
})
export class WeatherComponent implements OnInit, OnDestroy {

	weather: any = null;
	subscription: any;

	constructor(private alertService: AlertService, private weatherService: WeatherService) { }

	ngOnInit() {
		this.subscription = this.weatherService.getWeather().subscribe(
			(data) => {
				this.weather = data;
			},
			(error) => {
				this.alertService.addAlert('danger', 'Get Weather Error!', error);
			}
		);
	}

	ngOnDestroy() {
		// Unsubscribe to prevent memory leaks or something
		this.subscription.unsubscribe();
	}

}
