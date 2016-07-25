import * as config from '../common/config';

import {Injectable} from '@angular/core';
import {RequestOptions} from '@angular/http';
import {AuthHttp} from 'angular2-jwt';
import {xhrHeaders, handleError} from '../common/http-helpers';
import '../common/rxjs-operators';

@Injectable()
export class ClassesService {

    constructor (private authHttp: AuthHttp) {}

    public getClasses() {
		let body = JSON.stringify({});
		let headers = xhrHeaders();
        let options = new RequestOptions({ headers });

        return this.authHttp.post(config.backendURL + '/classes/get', body, options)
			.map(res => {
				let data = res.json();

				// Check if server-side error
				if(data.error) {
					throw new Error(data.error);
				}

				return data.classes;
			})
			.catch(handleError);
    }

    addClass(scheduleClass:Class) {
		let body = JSON.stringify(scheduleClass);
		let headers = xhrHeaders();
        let options = new RequestOptions({ headers });

        return this.authHttp.post(config.backendURL + '/planner/add', body, options)
			.map(res => {
				let data = res.json();

				// Check if server-side error
				if(data.error) {
					throw new Error(data.error);
				}

				return data.id;
			})
			.catch(handleError);
    }

    deleteClass(id:string) {
		let body = JSON.stringify({ id });
		let headers = xhrHeaders();
        let options = new RequestOptions({ headers });

        return this.authHttp.post(config.backendURL + '/planner/delete', body, options)
			.map(res => {
				let data = res.json();

				// Check if server-side error
				if(data.error) {
					throw new Error(data.error);
				}

				return;
			})
			.catch(handleError);
    }
}

interface Class {
	id?:string;
	name:string;
	color?:string;
	block?:string;
	type?:string;
	teacher:Teacher;
}

interface Teacher {
	prefix:string;
	firstName:string;
	lastName:string;
}
