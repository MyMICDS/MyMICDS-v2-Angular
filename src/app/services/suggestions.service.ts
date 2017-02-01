import { environment } from '../../environments/environment';

import { Injectable } from '@angular/core';
import { Http, RequestOptions } from '@angular/http';
import { AuthHttp } from 'angular2-jwt';
import { xhrHeaders, handleError } from '../common/http-helpers';

import { UserService } from '../services/user.service';

@Injectable()
export class SuggestionsService {

	constructor(private http: Http, private authHttp: AuthHttp, private userService: UserService) { }

	sendSuggestions(sug: SuggestionOpt) {
		let body = JSON.stringify(sug);
		let headers = xhrHeaders();
		let options = new RequestOptions({ headers });
		return this.authHttp.post(environment.backendURL + '/suggestion/send', body, options)
			.map(res => {
				let data = res.json() || {};
				if (data.error) {
					throw new Error(data.error);
				}
			})
			.catch(handleError);
	}

}

export interface SuggestionOpt {
	type: 'suggestion' | 'bug' | 'other';
	submission: string;
}
