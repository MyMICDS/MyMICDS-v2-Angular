import { Component, Input, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import * as ElementQueries from 'css-element-queries/src/ElementQueries';
import * as ResizeSensor from 'css-element-queries/src/ResizeSensor';

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
		},
		/** @TODO The following are just temporary for testing. Remove later! */
		location: {
			label: 'Location',
			type: 'string',
			default: 'MICDS'
		},
		decimalPrecision: {
			label: 'Decimal Precision',
			type: 'number',
			default: 2
		}
	}
})
export class WeatherComponent implements OnInit, OnDestroy {

	weather: any = null;
	subscription: any;
	@Input() set metric(m) {
		this.toggleMetric(m);
	}
	@ViewChild('moduleContainer') containerEl: ElementRef;

	constructor(private alertService: AlertService, private weatherService: WeatherService) { }

	ngOnInit() {
		ElementQueries.listen();
		ElementQueries.init();
		new ResizeSensor(this.containerEl.nativeElement, () => {
			console.log('changed');
		});
		this.subscription = this.weatherService.getWeather().subscribe(
			data => {
				this.weather = data;
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

	// Toggle the format of temperatures between Ferinheight and Celcius
	toggleMetric(isMetric) {
		if (this.weather) {
			if (isMetric) {
				this.weather.currently.windSpeed = (this.weather.currently.windSpeed * 1.609344).toPrecision(4);
				this.weather.currently.temperature = ((this.weather.currently.temperature - 32) / 1.8).toPrecision(4);
				this.weather.daily.data[0].temperatureMax = ((this.weather.daily.data[0].temperatureMax - 32) / 1.8).toPrecision(4);
				this.weather.daily.data[0].temperatureMin = ((this.weather.daily.data[0].temperatureMin - 32) / 1.8).toPrecision(4);
			} else {
				this.weather.currently.windSpeed = (this.weather.currently.windSpeed / 1.609344).toPrecision(4);
				this.weather.currently.temperature = (this.weather.currently.temperature * 1.8 + 32).toPrecision(4);
				this.weather.daily.data[0].temperatureMax = (this.weather.daily.data[0].temperatureMax * 1.8 + 32).toPrecision(4);
				this.weather.daily.data[0].temperatureMin = (this.weather.daily.data[0].temperatureMin * 1.8 + 32).toPrecision(4);
			}
		}
	}

}
