import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { UnsubscribeComponent } from './unsubscribe/unsubscribe.component';

import { SharedModule } from '../shared/shared.module';
import { UnsubscribeRoutingModule } from './unsubscribe.routing';

@NgModule({
	declarations: [UnsubscribeComponent],
	imports: [CommonModule, UnsubscribeRoutingModule, SharedModule]
})
export class UnsubscribeModule {}
