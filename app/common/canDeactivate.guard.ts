import { CanDeactivate } from '@angular/router';

export interface CanComponentDeactivate {
 canDeactivate: () => boolean;
}
//This interface is to detect if the component has method canDeactivate()

export class CanDeactivateGuard implements CanDeactivate<CanComponentDeactivate> {
  canDeactivate(component: CanComponentDeactivate):boolean {
    return component.canDeactivate ? component.canDeactivate() : true;
  }
}