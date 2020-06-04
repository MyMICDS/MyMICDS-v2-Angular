import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule  } from '@angular/forms';

import {
	ModalModule,
	PopoverModule,
	TooltipModule
} from 'ngx-bootstrap';

import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './logout/logout.component';
import { RegisterComponent } from './register/register.component';

import { SharedModule } from '../shared/shared.module';
import { AuthenticationRoutingModule } from './authentication.routing';

@NgModule({
  declarations: [
    ForgotPasswordComponent,
    LoginComponent,
    LogoutComponent,
    RegisterComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    AuthenticationRoutingModule,
    ModalModule.forRoot(),
    PopoverModule.forRoot(),
    TooltipModule.forRoot(),
    ReactiveFormsModule,
    SharedModule
  ]
})
export class AuthenticationModule { }
