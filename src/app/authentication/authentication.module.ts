import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './logout/logout.component';
import { RegisterComponent } from './register/register.component';

import { AuthenticationRoutingModule } from './authentication.routing';
import { SharedModule } from '../shared/shared.module';

@NgModule({
	declarations: [ForgotPasswordComponent, LoginComponent, LogoutComponent, RegisterComponent],
	imports: [
		CommonModule,
		FormsModule,
		AuthenticationRoutingModule,
		ReactiveFormsModule,
		SharedModule
	]
})
export class AuthenticationModule {}
