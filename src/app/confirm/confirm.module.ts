import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConfirmComponent } from './confirm/confirm.component';

import { SharedModule } from '../shared/shared.module';
import { ConfirmRoutingModule } from './confirm.routing';

@NgModule({
	declarations: [ConfirmComponent],
	imports: [CommonModule, ConfirmRoutingModule, SharedModule]
})
export class ConfirmModule {}
