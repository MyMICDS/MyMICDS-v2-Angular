import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CampusComponent } from './campus/campus.component';

import { SharedModule } from '../shared/shared.module';
import { CampusLifeRoutingModule } from './campus-life.routing';

@NgModule({
  declarations: [
    CampusComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    CampusLifeRoutingModule
  ]
})
export class CampusLifeModule { }
