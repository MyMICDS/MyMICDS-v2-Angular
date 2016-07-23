import {Injectable, Inject} from '@angular/core';
import {Headers, Http, RequestOptions, Response} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import '../common/rxjs-operators';

@Injectable()
export class LunchService {
    constructor (private http: Http) {}

    private extractData(res: Response) {
        let body = res.json();
        return body || { };
    }
    private handleError (error: any) {
        let errMsg = (error.message) ? error.message :
            error.status ? `${error.status} - ${error.statusText}` : error;
        console.error(errMsg); // log to console instead
        return Observable.throw(errMsg);
    }

    private Url = 'http://localhost:1420/lunch';

    public getLunch(date: {year: number, month: number, day: number}): Observable<any> {
        let body = JSON.stringify(date);
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });

        return this.http.post(this.Url+'/get', body, options)
                        .map(this.extractData)
                        .catch(this.handleError);
    }
}