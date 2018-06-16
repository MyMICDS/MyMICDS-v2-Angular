import { environment } from '../../environments/environment';
import { MyMICDS, MyMICDSOptions } from '@mymicds/sdk';

const mymicdsConfig: MyMICDSOptions = {
	baseURL: environment.backendURL,
	jwtGetter() {
		return sessionStorage.getItem('jwt') || localStorage.getItem('jwt');
	},
	jwtSetter(jwt: string, remember: boolean) {
		if (remember) {
			localStorage.setItem('jwt', jwt);
		} else {
			sessionStorage.setItem('jwt', jwt);
		}
	},
	jwtClear() {
		localStorage.removeItem('jwt');
		sessionStorage.removeItem('jwt');
	},
	updateBackground: true,
	updateUserInfo: true
};

export function MyMICDSFactory() {
	return new MyMICDS(mymicdsConfig);
}
