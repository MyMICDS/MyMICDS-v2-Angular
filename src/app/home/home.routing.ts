import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from "./home/home.component";

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
		]
	}
];

@NgModule({
  imports: [
    RouterModule.forChild(homeRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class HomeRoutingModule { }
