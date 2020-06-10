import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ConfirmComponent } from './confirm/confirm.component';

export function confirmTitle(url: string) {
	const parts = url.split('/');
	return `MyMICDS - Confirm account for ${parts[2].toLowerCase()}`;
}

const routes: Routes = [
	{
		path: 'confirm/:user/:hash',
		component: ConfirmComponent,
		data: {
			title: confirmTitle
		}
	}
];

@NgModule({
	imports: [
		RouterModule.forChild(routes)
	],
	exports: [
		RouterModule
	]
})
export class ConfirmRoutingModule { }
