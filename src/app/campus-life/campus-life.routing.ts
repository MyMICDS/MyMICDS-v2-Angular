import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CampusComponent } from './campus/campus.component';

const homeRoutes: Routes = [
	{
		path: '',
		component: CampusComponent
	}
];

@NgModule({
	imports: [RouterModule.forChild(homeRoutes)],
	exports: [RouterModule]
})
export class CampusLifeRoutingModule {}
