import * as config from '../common/config';

import {Injectable} from '@angular/core';
import {RequestOptions} from '@angular/http';
import {AuthHttp} from 'angular2-jwt';
import {xhrHeaders, handleError} from '../common/http-helpers';
import '../common/rxjs-operators';

@Injectable()
export class ClassesService {
    constructor(private authHttp: AuthHttp) {}

    getClasses() {
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

				// Turn all colors to lowercase
				for(let i = 0; i < data.classes.length; i++) {
					data.classes[i].color = data.classes[i].color.toLowerCase();
				}

				return data.classes;
			})
			.catch(handleError);
    }

    addClass(scheduleClass:Class) {

		// Convert teacher object to individual form inputs
		let formattedClass:any = scheduleClass;

		formattedClass.teacherPrefix = scheduleClass.teacher.prefix;
		formattedClass.teacherFirstName = scheduleClass.teacher.firstName;
		formattedClass.teacherLastName = scheduleClass.teacher.lastName;
		formattedClass.id = scheduleClass._id;

		let body = JSON.stringify(formattedClass);
		let headers = xhrHeaders();
        let options = new RequestOptions({ headers });

        return this.authHttp.post(config.backendURL + '/classes/add', body, options)
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

        return this.authHttp.post(config.backendURL + '/classes/delete', body, options)
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

export interface Class {
	_id?:string;
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
