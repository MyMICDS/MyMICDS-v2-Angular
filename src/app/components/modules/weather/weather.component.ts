import { MyMICDS, GetWeatherResponse } from '@mymicds/sdk';

import { Component, Input, OnInit, ElementRef, ViewChild, NgZone } from '@angular/core';
import * as ElementQueries from 'css-element-queries/src/ElementQueries';

import { SubscriptionsComponent } from '../../../common/subscriptions-component';

@Component({
	selector: 'mymicds-weather',
	templateUrl: './weather.component.html',
	styleUrls: ['./weather.component.scss']
})
export class WeatherComponent extends SubscriptionsComponent implements OnInit {

	weather: GetWeatherResponse['weather'] = null;
	// Weather object converted to metric
	weatherMetric: GetWeatherResponse['weather'] = null;
	@Input() metric = false;
	@ViewChild('moduleContainer') containerEl: ElementRef;

	constructor(private mymicds: MyMICDS, private ngZone: NgZone) {
		super();
	}

	ngOnInit() {
		ElementQueries.init();

		this.addSubscription(
			this.mymicds.weather.get().subscribe(({ weather }) => {
				this.ngZone.run(() => {
					this.weather = weather;
					this.weatherMetric = this.convertToMetric(weather);
				});
			})
		);
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
