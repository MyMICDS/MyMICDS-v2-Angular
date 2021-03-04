import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { BulletinArchivesComponent } from './bulletin-archives/bulletin-archives.component';
import { DailyBulletinComponent } from './daily-bulletin/daily-bulletin.component';

const dailyBulletinRoutes: Routes = [
	{
		path: '',
		component: DailyBulletinComponent
	},
	{
		path: 'archives',
		component: BulletinArchivesComponent
	},
	{
		path: 'parse',
		children: [
			{
				path: '',
				component: DailyBulletinComponent,
				data: { parse: true }
			},
			{
				path: ':bulletin',
				component: DailyBulletinComponent,
				data: { parse: true }
			}
		]
	},
	{
		path: ':bulletin',
		component: DailyBulletinComponent
	}
];

@NgModule({
	imports: [RouterModule.forChild(dailyBulletinRoutes)],
	exports: [RouterModule]
})
export class DailybulletinRoutingModule {}
