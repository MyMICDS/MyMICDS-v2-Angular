import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './common/auth.guard';
import { CanDeactivateGuard } from './common/canDeactivate.guard';

import { capitalizeURL } from './common/utils';

import { AlertDebugComponent } from './components/alert-debug/alert-debug.component';
import { LoginComponent } from './components/login/login.component';
import { LogoutComponent } from './components/logout/logout.component';
import { RegisterComponent } from './components/register/register.component';
import { ConfirmComponent } from './components/confirm/confirm.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { UnsubscribeComponent } from './components/unsubscribe/unsubscribe.component';
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
		path: 'alert-debug',
		component: AlertDebugComponent
	}
];

export const appRoutingProviders: any[] = [
	AuthGuard,
	CanDeactivateGuard
];

export const routing = RouterModule.forRoot(appRoutes);
