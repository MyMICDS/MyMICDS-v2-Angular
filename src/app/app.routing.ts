import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './common/auth.guard';
import { CanDeactivateGuard } from './common/canDeactivate.guard';
import * as moment from 'moment';

import { capitalizeURL, months } from './common/utils';

import { HomeComponent } from './components/home/home.component';
import { LunchComponent } from './components/lunch/lunch.component';
import { PlannerComponent } from './components/planner/planner.component';
import { DailyBulletinComponent } from './components/daily-bulletin/daily-bulletin.component';
import { BulletinArchivesComponent } from './components/bulletin-archives/bulletin-archives.component';
import { SettingsComponent } from './components/settings/settings.component';
import { AboutComponent } from './components/about/about.component';
import { AlertDebugComponent } from './components/alert-debug/alert-debug.component';
import { HelpComponent } from './components/help/help.component';
import { LoginComponent } from './components/login/login.component';
import { LogoutComponent } from './components/logout/logout.component';
import { ModuleInspectorComponent } from './components/module-inspector/module-inspector.component';
import { RegisterComponent } from './components/register/register.component';
import { ConfirmComponent } from './components/confirm/confirm.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { UnsubscribeComponent } from './components/unsubscribe/unsubscribe.component';
import { SportsComponent } from './components/sports/sports.component';
import { SuggestionsComponent } from './components/suggestions/suggestions.component';
import { QuotesComponent } from './components/quotes/quotes.component';
import { CampusComponent } from './components/campus/campus.component';

/**
 * Title functions
 * We MUST separate them and export them otherwise Angular can't resolve it statically or something
 */

export function defaultTitleFunction(url: string) {
	return `MyMICDS - ${capitalizeURL(url)}`;
}

export function plannerTitle(url: string) {
	const parts = url.split('/');
	const date = moment();
	// Use moment.js's .year and .month methods to take advantage of overflowing (Ex. month of -1 is December of previous year)
	// (This is same strategy used to determine date of planner component, so title will always be synced)
	date.year(Number(parts[2]));
	date.month(Number(parts[3]) - 1);
	return `MyMICDS - Planner - ${months[date.month()]} ${date.year()}`;
}

export function confirmTitle(url: string) {
	const parts = url.split('/');
	return `MyMICDS - Confirm account for ${parts[2].toLowerCase()}`;
}

export function resetPasswordTitle(url: string) {
	const parts = url.split('/');
	return `MyMICDS - Reset password for ${parts[2].toLowerCase()}`;
}

export function unsubscribeTitle(url: string) {
	const parts = url.split('/');
	return `MyMICDS - Unsubscribe ${parts[2].toLowerCase()}@micds.org`;
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
		path: 'home',
		children: [
			{
				path: '',
				component: HomeComponent
			},
			{
				path: 'edit',
				component: HomeComponent,
				data: { edit: true }
			}
		]
	},
	{
		path: 'lunch',
		component: LunchComponent
	},
	{
		path: 'planner',
		children: [
			{
				path: '',
				component: PlannerComponent
			},
			{
				path: ':year/:month',
				component: PlannerComponent,
				data: {
					title: plannerTitle
				}
			}
		]
	},
	{
		path: 'daily-bulletin',
		children: [
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
		]
	},
	{
		path: 'settings',
		component: SettingsComponent,
		canActivate: [AuthGuard],
		canDeactivate: [CanDeactivateGuard]
	},
	{
		path: 'about',
		component: AboutComponent
	},
	{
		path: 'help',
		component: HelpComponent
	},
	{
		path: 'login',
		component: LoginComponent
	},
	{
		path: 'logout',
		component: LogoutComponent,
		canActivate: [AuthGuard]
	},
	{
		path: 'register',
		component: RegisterComponent
	},
	{
		path: 'confirm/:user/:hash',
		component: ConfirmComponent,
		data: {
			title: confirmTitle
		}
	},
	{
		path: 'forgot-password',
		component: ForgotPasswordComponent
	},
	{
		path: 'reset-password/:user/:hash',
		component: ResetPasswordComponent,
		data: {
			title: resetPasswordTitle
		}
	},
	{
		path: 'unsubscribe/:user/:hash',
		component: UnsubscribeComponent,
		data: {
			title: unsubscribeTitle
		}
	},
	{
		path: 'sports',
		component: SportsComponent
	},
	{
		path: 'suggestions',
		component: SuggestionsComponent,
		canActivate: [AuthGuard]
	},
	{
		path: 'quote',
		component: QuotesComponent
	},
	{
		path: 'module-inspector',
		component: ModuleInspectorComponent
	},
	{
		path: 'alert-debug',
		component: AlertDebugComponent
	},
	{
		path: 'campus',
		component: CampusComponent
	}
];

export const appRoutingProviders: any[] = [
	AuthGuard,
	CanDeactivateGuard
];

export const routing = RouterModule.forRoot(appRoutes);
