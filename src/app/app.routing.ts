import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './common/auth.guard';
import { CanDeactivateGuard } from './common/canDeactivate.guard';

import { capitalizeURL } from './common/utils';

import { AlertDebugComponent } from './components/alert-debug/alert-debug.component';
import { SportsComponent } from './components/sports/sports.component';
import { QuotesComponent } from './components/quotes/quotes.component';

/**
 * Title functions
 * We MUST separate them and export them otherwise Angular can't resolve it statically or something
 */
export function defaultTitleFunction(url: string) {
	return `MyMICDS - ${capitalizeURL(url)}`;
}

/**
 * Router Config
 */
export const appRoutes: Routes = [
	{
		path: '',
		redirectTo: '/home',
		pathMatch: 'full',
	},
	{
		path: 'sports',
		component: SportsComponent,
	},
	{
		path: 'quote',
		component: QuotesComponent,
	},
	{
		path: 'alert-debug',
		component: AlertDebugComponent,
	},
	{
		path: 'about',
		loadChildren: () =>
			import('./about/about.module').then((m) => m.AboutModule)
	},
	{
		path: 'campus',
		loadChildren: () =>
			import('./campus-life/campus-life.module').then((m) => m.CampusLifeModule)
	},
	{
		path: 'home',
		loadChildren: () =>
			import('./home/home.module').then((m) => m.HomeModule)
	},
	{
		path: 'planner',
		loadChildren: () =>
			import('./planner/planner.module').then((m) => m.PlannerModule)
	},
	{
		path: 'lunch',
		loadChildren: () =>
			import('./lunch/lunch.module').then((m) => m.LunchModule)
	},
	{
		path: 'reset-password',
		loadChildren: () =>
			import('./reset-password/reset-password.module').then((m) => m.ResetPasswordModule)
	},
	{
		path: 'confirm',
		loadChildren: () =>
			import('./confirm/confirm.module').then((m) => m.ConfirmModule)
	},
	{
		path: 'settings',
		loadChildren: () =>
			import('./settings/settings.module').then((m) => m.SettingsModule)
	},
	{
		path: 'unsubscribe',
		loadChildren: () =>
			import('./unsubscribe/unsubscribe.module').then((m) => m.UnsubscribeModule)
	},
	{
		path: 'daily-bulletin',
		loadChildren: () =>
			import('./daily-bulletin/daily-bulletin.module').then((m) => m.DailyBulletinModule)
	}
];

export const appRoutingProviders: any[] = [AuthGuard, CanDeactivateGuard];

export const routing = RouterModule.forRoot(appRoutes);
