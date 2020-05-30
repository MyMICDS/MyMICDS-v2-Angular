import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from "./home/home.component";
import { SharedModule } from '../shared/shared.module';

const homeRoutes: Routes = [
  {
		path: 'home',
		children: [
			{
				path: '',
				component: HomeComponent
			},
			{
				path: 'edit',
				component: HomeComponent,
				data: { edit: true }
			}


      // ,
      // {
      //   path: 'module-inspector',
      //   component: ModuleInspectorComponent
      // }
		]
	}
];

//taken from angular.io
//Only call RouterModule.forRoot in the root AppRoutingModule (or the AppModule if
//that's where you register top level application routes). In any other module, you
//must call the RouterModule.forChild method to register additional routes.

@NgModule({
  imports: [
    RouterModule.forChild(homeRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class HomeRoutingModule { }
