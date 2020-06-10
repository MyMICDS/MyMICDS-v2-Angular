import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from '../common/auth.guard';

import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './logout/logout.component';
import { RegisterComponent } from './register/register.component';

const authRoutes: Routes = [
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
		path: 'forgot-password',
		component: ForgotPasswordComponent
	}
];

@NgModule({
	imports: [
		RouterModule.forChild(authRoutes)
	],
	exports: [
		RouterModule
	]
})
export class AuthenticationRoutingModule { }
