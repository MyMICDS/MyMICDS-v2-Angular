import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ConfirmComponent } from './confirm/confirm.component';

import { ConfirmRoutingModule } from './confirm.routing';
import { SharedModule } from '../shared/shared.module';

@NgModule({
	declarations: [ConfirmComponent],
	imports: [CommonModule, ConfirmRoutingModule, SharedModule]
})
export class ConfirmModule {}
