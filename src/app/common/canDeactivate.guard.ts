import { Injectable } from "@angular/core";
export interface CanComponentDeactivate {
	canDeactivate: () => boolean;
}

@Injectable()
export class CanDeactivateGuard {
	canDeactivate(component: CanComponentDeactivate): boolean {
		return component.canDeactivate ? component.canDeactivate() : true;
	}
}
