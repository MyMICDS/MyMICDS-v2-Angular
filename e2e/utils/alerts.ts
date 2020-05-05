import { AlertType } from '../../src/app/common/alert';
import { by, element } from 'protractor';

export function alert(type: AlertType) {
	return element(by.css(`div.alert.alert-${type}`));
}
