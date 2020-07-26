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
		let metric: Weather = {
			temperature: this.convertTemperature(weather.temperature),
			temperatureLow: this.convertTemperature(weather.temperatureLow),
			temperatureHigh: this.convertTemperature(weather.temperatureHigh),
			humidity: weather.humidity,
			precipitationChance: weather.precipitationChance,
			windSpeed: this.convertWindspeed(weather.windSpeed),
			windDir: weather.windDir,
			weatherIcon: weather.weatherIcon
		}
		return metric;
	}

	// Converts fahrenheight to celsius
	private convertTemperature(f: number) {
		return Number(((f - 32) / 1.8).toPrecision(2));
	}

	// Converts from miles per hour to kilometers per hour
	private convertWindspeed(mh: number) {
		return Number((mh * 1.609344).toPrecision(2));
	}

}
