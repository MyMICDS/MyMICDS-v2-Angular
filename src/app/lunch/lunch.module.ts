import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LunchComponent } from './lunch/lunch.component';

import { SharedModule } from '../shared/shared.module';

import { LunchRoutingModule } from './lunch.routing';

@NgModule({
  declarations: [
    LunchComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    LunchRoutingModule
  ]
})
export class LunchModule { }
