import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { ModuleInspectorComponent } from './module-inspector/module-inspector.component';

const homeRoutes: Routes = [
	{
		path: '',
		component: HomeComponent
	},
	{
		path: 'edit',
		component: HomeComponent,
		data: { edit: true }
	},
	{
		path: 'module-inspector',
		component: ModuleInspectorComponent
	}
];

@NgModule({
	imports: [RouterModule.forChild(homeRoutes)],
	exports: [RouterModule]
})
export class HomeRoutingModule {}
