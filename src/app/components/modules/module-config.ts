import { OptionsConfig, OptionValue } from './module-options';

import { BookmarksComponent } from './bookmarks/bookmarks.component';
import { CountdownComponent, COUNTDOWN_MODE } from './countdown/countdown.component';
import { GpaCalculatorComponent } from './gpa-calculator/gpa-calculator.component';
import { ProgressComponent } from './progress/progress.component';
import { ScheduleComponent } from './schedule/schedule.component';
import { SimplifiedLunchComponent} from './simplified-lunch/simplified-lunch.component';
import { SimplifiedScheduleComponent } from './simplified-schedule/simplified-schedule.component';
import { SnowdayComponent } from './snowday/snowday.component';
import { StickynotesComponent, COLOR } from './stickynotes/stickynotes.component';
import { TwitterComponent } from './twitter/twitter.component';
import { WeatherComponent } from './weather/weather.component';

import { faTwitter } from '@fortawesome/free-brands-svg-icons';
import { IconDefinition } from '@fortawesome/fontawesome-common-types';

// We need a static array for the app module component entries
// Not even looping through the config will work because Angular AoT complains
export const moduleComponents: any[] = [
	BookmarksComponent,
	CountdownComponent,
	GpaCalculatorComponent,
	ProgressComponent,
	ScheduleComponent,
	SimplifiedLunchComponent,
	SimplifiedScheduleComponent,
	SnowdayComponent,
	StickynotesComponent,
	TwitterComponent,
	WeatherComponent
];

export const config: Config = {
	bookmarks: {
		displayName: 'Bookmarks',
		icon: 'bookmark',
		component: BookmarksComponent,
		defaultHeight: 1,
		defaultWidth: 1,
		options: {
			label: {
				label: 'Label',
				type: 'string',
				default: 'Really Cool Site'
			},
			icon: {
				label: 'Icon',
				type: 'ICON',
				default: 'bookmark'
			},
			url: {
				label: 'URL',
				type: 'string',
				default: 'https://mymicds.net'
			}
		}
	},
	countdown: {
		displayName: 'Countdown',
		icon: 'clock',
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
	gpaCalculator: {
		displayName: 'GPA Calculator',
		icon: 'check-square',
		component: GpaCalculatorComponent,
		defaultHeight: 2,
		defaultWidth: 2
	},
	progress: {
		displayName: 'Progress',
		icon: 'tasks',
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
		icon: 'calendar',
		component: ScheduleComponent,
		defaultHeight: 2,
		defaultWidth: 2
	},
	simplifiedLunch: {
		displayName: 'Lunch',
		icon: 'utensils',
		component: SimplifiedLunchComponent,
		defaultHeight: 2,
		defaultWidth: 2
	},
	simplifiedSchedule: {
		displayName: 'Simplified Schedule',
		icon: 'calendar',
		component: SimplifiedScheduleComponent,
		defaultHeight: 1,
		defaultWidth: 2
	},
	snowday: {
		displayName: 'Snowday',
		icon: 'snowflake',
		component: SnowdayComponent,
		defaultHeight: 1,
		defaultWidth: 2
	},
	stickynotes: {
		displayName: 'Sticky Notes',
		icon: 'sticky-note',
		component: StickynotesComponent,
		defaultHeight: 2,
		defaultWidth: 2,
		options: {
			color: {
				label: 'Color',
				type: {
					name: 'COLOR',
					values: [
						{
							name: 'Gray',
							value: COLOR.GRAY
						},
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
				default: COLOR.WHITE
			}
		}
	},
	twitter: {
		displayName: 'Twitter',
		icon: faTwitter, // iconDefiniton used since it's in a different icon pack
		component: TwitterComponent,
		defaultHeight: 2,
		defaultWidth: 1,
		background: '#292F33'
	},
	weather: {
		displayName: 'Weather',
		icon: 'cloud',
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

	const options: { [option: string]: OptionValue } = {};
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
	icon: string | IconDefinition;
	component: any;
	defaultHeight: number;
	defaultWidth: number;
	background?: string;
	options?: OptionsConfig;
}
