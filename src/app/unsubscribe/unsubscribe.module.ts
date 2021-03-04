import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UnsubscribeComponent } from './unsubscribe/unsubscribe.component';

import { UnsubscribeRoutingModule } from './unsubscribe.routing';
import { SharedModule } from '../shared/shared.module';

@NgModule({
	declarations: [UnsubscribeComponent],
	imports: [CommonModule, UnsubscribeRoutingModule, SharedModule]
})
export class UnsubscribeModule {}
