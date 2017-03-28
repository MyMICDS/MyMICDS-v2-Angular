import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './common/auth.guard';
import { CanDeactivateGuard } from './common/canDeactivate.guard';

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

const appRoutes: Routes = [
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
		path: 'planner/:year/:month',
		component: PlannerComponent,
	},
	{
		path: 'planner',
		component: PlannerComponent
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
		]
	},
	{
		path: 'daily-bulletin/:bulletin',
		component: DailyBulletinComponent
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
		component: ConfirmComponent
	},
	{
		path: 'forgot-password',
		component: ForgotPasswordComponent
	},
	{
		path: 'reset-password/:user/:hash',
		component: ResetPasswordComponent
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
