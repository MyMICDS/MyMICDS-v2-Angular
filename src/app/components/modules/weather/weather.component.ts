import { Component, Input, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import * as ElementQueries from 'css-element-queries/src/ElementQueries';

import { MyMICDSModule } from '../modules-main';

import { AlertService } from '../../../services/alert.service';
import { WeatherService } from '../../../services/weather.service';

@Component({
	selector: 'mymicds-weather',
	templateUrl: './weather.component.html',
	styleUrls: ['./weather.component.scss']
})
@MyMICDSModule({
	name: 'weather',
	icon: 'fa-cloud',
	defaultHeight: 1,
	defaultWidth: 2,
	options: {
		metric: {
			label: 'Metric Units',
			type: 'boolean',
			default: false
		}
	}
})
export class WeatherComponent implements OnInit, OnDestroy {

	weather: any = null;
	// Weather object converted to metric
	weatherMetric: any = null;
	subscription: any;
	@Input() metric = false;
	@ViewChild('moduleContainer') containerEl: ElementRef;

	constructor(private alertService: AlertService, private weatherService: WeatherService) { }

	ngOnInit() {
		ElementQueries.listen();
		ElementQueries.init();
		this.subscription = this.weatherService.getWeather().subscribe(
			data => {
				this.weather = data;
				this.weatherMetric = this.convertToMetric(data);
			},
			error => {
				this.alertService.addAlert('danger', 'Get Weather Error!', error);
			}
		);
	}

	ngOnDestroy() {
		// Unsubscribe to prevent memory leaks or something
		this.subscription.unsubscribe();
	}

	private convertToMetric(weather) {
		const metric = JSON.parse(JSON.stringify(weather));
		metric.currently.windSpeed = this.convertWindspeed(weather.currently.windSpeed);
		metric.currently.temperature = this.convertTemperature(weather.currently.temperature);
		metric.daily.data[0].temperatureMax = this.convertTemperature(weather.daily.data[0].temperatureMax);
		metric.daily.data[0].temperatureMin = this.convertTemperature(weather.daily.data[0].temperatureMin);
		return metric;
	}

	// Converts fahrenheight to celsius
	private convertTemperature(f: number) {
		return ((f - 32) / 1.8).toPrecision(2);
	}

	// Converts from miles per hour to kilometers per hour
	private convertWindspeed(mh: number) {
		return (mh * 1.609344).toPrecision(2);
	}

}
