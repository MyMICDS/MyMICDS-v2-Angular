import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

import { ResetPasswordComponent } from './reset-password/reset-password.component';

import { ResetPasswordRoutingModule } from './reset-password.routing';
import { SharedModule } from '../shared/shared.module';

@NgModule({
	declarations: [ResetPasswordComponent],
	imports: [
		CommonModule,
		ResetPasswordRoutingModule,
		SharedModule,
		FormsModule,
		ReactiveFormsModule
	]
})
export class ResetPasswordModule {}
