import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ResetPasswordComponent } from './reset-password/reset-password.component';

export function resetPasswordTitle(url: string) {
	const parts = url.split('/');
	return `MyMICDS - Reset password for ${parts[2].toLowerCase()}`;
}

const routes: Routes = [
	{
		path: ':user/:hash',
		component: ResetPasswordComponent,
		data: {
			title: resetPasswordTitle
		}
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class ResetPasswordRoutingModule {}
