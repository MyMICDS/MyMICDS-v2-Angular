import { School, SchoolLunch } from '@mymicds/sdk';

export interface DayLunch {
	date: {
		weekday: string;
		date: string;
		today: boolean;
	};
	lunch: Record<School, SchoolLunch> | Record<string, never>;
}
