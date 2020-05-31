import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ModuleInspectorComponent } from './module-inspector/module-inspector.component';

const sharedRoutes: Routes = [
  {
    path: 'module-inspector',
    component: ModuleInspectorComponent
	}
];

//taken from angular.io
//Only call RouterModule.forRoot in the root AppRoutingModule (or the AppModule if
//that's where you register top level application routes). In any other module, you
//must call the RouterModule.forChild method to register additional routes.

@NgModule({
  imports: [
    RouterModule.forChild(sharedRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class SharedRoutingModule { }
