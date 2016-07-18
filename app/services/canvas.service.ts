import {Injectable, Inject} from '@angular/core';
import {Headers, Http, RequestOptions, Response} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import '../common/rxjs-operators';
import {UserService} from './user.service';

@Injectable()
export class CanvasService {
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

    private Url = 'http://localhost:1420/canvas'
    public getEvents(date:{year:number;month:number}):
    Observable<{
        error: string;
        hasURL: boolean;
        events: any[]}> {
        let body = JSON.stringify(date);
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });

        return this.http.post(this.Url+'/get-events', body, options)
                        .map(this.extractData)
                        .catch(this.handleError);
    }

    public setUrl(url:string):Observable<{error:string;valid:boolean;url:string}> {
        let body = JSON.stringify({url:url});
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });

        return this.http.post(this.Url+'/set-url', body, options)
                        .map(this.extractData)
                        .catch(this.handleError);
    }

    public testUrl(url:string):Observable<{error:string;valid:boolean;url:string}> {
        let body = JSON.stringify({url:url});
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });

        return this.http.post(this.Url+'/test-url', body, options)
                        .map(this.extractData)
                        .catch(this.handleError);
    }
}
