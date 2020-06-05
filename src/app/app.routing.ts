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
		pathMatch: 'full'
	},
	{
		path: 'sports',
		component: SportsComponent
	},
	{
		path: 'quote',
		component: QuotesComponent
	},
	{
		path: 'alert-debug',
		component: AlertDebugComponent
	},
	{
		path: 'about',
		loadChildren: () => import("./about/about.module").then(m => m.AboutModule)
	},
	{
		path: 'suggestions',
		loadChildren: () => import("./about/about.module").then(m => m.AboutModule),
		canActivate: [AuthGuard]
	}
];

export const appRoutingProviders: any[] = [
	AuthGuard,
	CanDeactivateGuard
];

export const routing = RouterModule.forRoot(appRoutes);
