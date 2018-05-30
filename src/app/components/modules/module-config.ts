import moment from 'moment';

import { OptionsConfig } from './module-options';

import { CountdownComponent, COUNTDOWN_MODE } from './countdown/countdown.component';
import { ProgressComponent } from './progress/progress.component';
import { ScheduleComponent } from './schedule/schedule.component';
import { SimplifiedLunchComponent} from './simplified-lunch/simplified-lunch.component';
import { SimplifiedScheduleComponent } from './simplified-schedule/simplified-schedule.component';
import { SnowdayComponent } from './snowday/snowday.component';
import { StickynotesComponent, COLOR } from './stickynotes/stickynotes.component';
import { WeatherComponent } from './weather/weather.component';

// We need a static array for the app module component entries
// Not even looping through the config will work because Angular AoT complains
export const moduleComponents: any[] = [
	CountdownComponent,
	ProgressComponent,
	ScheduleComponent,
	SimplifiedLunchComponent,
	SimplifiedScheduleComponent,
	SnowdayComponent,
	StickynotesComponent,
	WeatherComponent
];

export const config: Config = {
	countdown: {
		displayName: 'Countdown',
		icon: 'fa-clock-o',
		component: CountdownComponent,
		defaultHeight: 1,
		defaultWidth: 2,
		options: {
			schoolDays: {
				label: 'Only Count School Days',
				type: 'boolean',
				default: true
			},
			shake: {
				label: 'Shake as Date Approaches',
				type: 'boolean',
				default: true
			},
			mode: {
				label: 'Countdown to',
				type: {
					name: 'COUNTDOWN_MODE',
					values: [
						{
							name: 'Any Time Off',
							value: COUNTDOWN_MODE.TIME_OFF
						},
						{
							name: 'Start of School',
							value: COUNTDOWN_MODE.START
						},
						{
							name: 'End of School',
							value: COUNTDOWN_MODE.END
						},
						{
							name: 'Next Break',
							value: COUNTDOWN_MODE.VACATION
						},
						{
							name: 'Next Long Weekend',
							value: COUNTDOWN_MODE.LONG_WEEKEND
						},
						{
							name: 'Next Weekend',
							value: COUNTDOWN_MODE.WEEKEND
						},
						{
							name: 'Custom Date',
							value: COUNTDOWN_MODE.CUSTOM
						}
					]
				},
				default: COUNTDOWN_MODE.END,
			},
			eventLabel: {
				label: 'Label',
				type: 'string',
				default: 'Countdown',
				showIf: {
					mode: COUNTDOWN_MODE.CUSTOM
				}
			},
			countdownTo: {
				label: 'Date',
				type: 'Date',
				default: new Date(),
				showIf: {
					mode: COUNTDOWN_MODE.CUSTOM
				}
			}
		}
	},
	progress: {
		displayName: 'Progress',
		icon: 'fa-tasks',
		component: ProgressComponent,
		defaultHeight: 3,
		defaultWidth: 4,
		options: {
			showDate: {
				label: 'Show Date',
				type: 'boolean',
				default: true
			}
		}
	},
	schedule: {
		displayName: 'Schedule',
		icon: 'fa-calendar',
		component: ScheduleComponent,
		defaultHeight: 2,
		defaultWidth: 2
	},
	simplifiedLunch: {
		displayName: 'Lunch',
		icon: 'fa-cutlery',
		component: SimplifiedLunchComponent,
		defaultHeight: 2,
		defaultWidth: 2
	},
	simplifiedSchedule: {
		displayName: 'Simplified Schedule',
		icon: 'fa-calendar',
		component: SimplifiedScheduleComponent,
		defaultHeight: 1,
		defaultWidth: 2
	},
	snowday: {
		displayName: 'Snowday',
		icon: 'fa-snowflake-o',
		component: SnowdayComponent,
		defaultHeight: 1,
		defaultWidth: 2
	},
	stickynotes: {
		displayName: 'Sticky Notes',
		icon: 'fa-sticky-note-o',
		component: StickynotesComponent,
		defaultHeight: 2,
		defaultWidth: 2,
		options: {
			color: {
				label: 'color',
				default: 'white',
				type: {
					name: 'COLOR',
					values: [
						{
							name: 'Orange',
							value: COLOR.ORANGE
						},
						{
							name: 'Pink',
							value: COLOR.PINK
						},
						{
							name: 'Teal',
							value: COLOR.TEAL
						},
						{
							name: 'White',
							value: COLOR.WHITE
						},
						{
							name: 'Yellow',
							value: COLOR.YELLOW
						}
					]
				},
			}
		}
	},
	weather: {
		displayName: 'Weather',
		icon: 'fa-cloud',
		component: WeatherComponent,
		defaultHeight: 2,
		defaultWidth: 2,
		options: {
			metric: {
				label: 'Metric Units',
				type: 'boolean',
				default: false
			}
		}
	}
};

export function getDefaultOptions(moduleName: string) {
	const module = config[moduleName];
	if (!module) {
		return {};
	}

	const optionsConfig = module.options;
	if (!optionsConfig) {
		return {};
	}

	const options = {};
	for (const optionKey of Object.keys(optionsConfig)) {
		options[optionKey] = optionsConfig[optionKey].default;
	}
	return options;
}

export interface Config {
	[name: string]: ModuleConfig;
}

export interface ModuleConfig {
	displayName: string;
	icon: string;
	component: any;
	defaultHeight: number;
	defaultWidth: number;
	options?: OptionsConfig;
}
