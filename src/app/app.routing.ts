import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './common/auth.guard';
import { CanDeactivateGuard } from './common/canDeactivate.guard';

import { capitalizeURL, months } from './common/utils';

import { HomeComponent } from './components/home/home.component';
import { LunchComponent } from './components/lunch/lunch.component';
import { PlannerComponent } from './components/planner/planner.component';
import { DailyBulletinComponent } from './components/daily-bulletin/daily-bulletin.component';
import { BulletinArchivesComponent } from './components/bulletin-archives/bulletin-archives.component';
import { SettingsComponent } from './components/settings/settings.component';
import { AboutComponent } from './components/about/about.component';
import { HelpComponent } from './components/help/help.component';
import { LoginComponent } from './components/login/login.component';
import { LogoutComponent } from './components/logout/logout.component';
import { RegisterComponent } from './components/register/register.component';
import { ConfirmComponent } from './components/confirm/confirm.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { SportsComponent } from './components/sports/sports.component';
import { SuggestionsComponent } from './components/suggestions/suggestions.component';
import { QuotesComponent } from './components/quotes/quotes.component';

/**
 * Title functions
 * We MUST separate them and export them otherwise Angular can't resolve it statically or something
 */

export function defaultTitleFunction(url: string) {
	return `MyMICDS - ${capitalizeURL(url)}`;
}

export function plannerTitle(url: string) {
	const parts = url.split('/');
	return `MyMICDS - Planner - ${months[Number(parts[3]) - 1]} ${parts[2]}`;
}

export function confirmTitle(url: string) {
	const parts = url.split('/');
	return `MyMICDS - Planner - ${months[Number(parts[3]) - 1]} ${parts[2]}`;
}

export function resetPasswordTitle(url: string) {
	const parts = url.split('/');
	return `MyMICDS - Reset password for ${parts[2].toLowerCase()}`;
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
		component: HomeComponent
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
		component: LogoutComponent
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
	}
];

export const appRoutingProviders: any[] = [
	AuthGuard,
	CanDeactivateGuard
];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
