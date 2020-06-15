import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UnsubscribeComponent } from './unsubscribe/unsubscribe.component';

export function unsubscribeTitle(url: string) {
	const parts = url.split('/');
	return `MyMICDS - Unsubscribe ${parts[2].toLowerCase()}@micds.org`;
}

const routes: Routes = [
	{
		path: ':user/:hash',
		component: UnsubscribeComponent,
		data: {
			title: unsubscribeTitle
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
export class UnsubscribeRoutingModule { }
