import * as config from '../common/config';

import {Injectable} from '@angular/core';
import {RequestOptions} from '@angular/http';
import {AuthHttp} from 'angular2-jwt';
import {xhrHeaders, handleError} from '../common/http-helpers';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class AliasService {
    constructor(private authHttp:AuthHttp) {}

    getAlias() {
      let body = null;
      let headers = xhrHeaders();
      let options = new RequestOptions({ headers });

    }
}
