import { MyMICDS, Weather } from '@mymicds/sdk';

import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { ElementQueries } from 'css-element-queries';

import { SubscriptionsComponent } from '../../../common/subscriptions-component';

@Component({
	selector: 'mymicds-weather',
	templateUrl: './weather.component.html',
	styleUrls: ['./weather.component.scss']
})
export class WeatherComponent extends SubscriptionsComponent implements OnInit {

	weather: Weather | null = null;
	// Weather object converted to metric
	weatherMetric: Weather | null = null;
	@Input() metric = false;
	@ViewChild('moduleContainer') containerEl: ElementRef;

	constructor(private mymicds: MyMICDS) {
		super();
	}

	ngOnInit() {
		ElementQueries.init();

		this.addSubscription(
			this.mymicds.weather.get().subscribe(({ weather }) => {
				this.weather = weather;
				this.weatherMetric = this.convertToMetric(weather);
			})
		);
	}

	private convertToMetric(weather: Weather) {
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

	// TODO finish
	private convertDirection(deg: number) {
		return deg;
	}

}
