import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DailyBulletinComponent } from './daily-bulletin/daily-bulletin.component';
import { BulletinArchivesComponent } from './bulletin-archives/bulletin-archives.component';

import { SharedModule } from '../shared/shared.module';
import { DailybulletinRoutingModule } from './daily-bulletin.routing';

@NgModule({
  declarations: [
    DailyBulletinComponent,
    BulletinArchivesComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    DailybulletinRoutingModule
  ]
})
export class DailyBulletinModule { }
