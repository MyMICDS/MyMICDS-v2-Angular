import {Injectable, Inject} from '@angular/core';
import {Headers, Http, RequestOptions, Response} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import '../common/rxjs-operators';

@Injectable()
export class PlannerService {
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

    private Url = 'http://localhost:1420/planner';

    public getEvents(month: {year:number, month: number}):Observable<{error:any, events:any[]}> {
        let body = JSON.stringify(month);
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });

        return this.http.post(this.Url+'/get', body, options)
                        .map(this.extractData)
                        .catch(this.handleError);
    }

    public addEvent(info: {
        id: any,
        title: string,
        desc: string,
        'class-id': string,
        'start-year': number,
        'start-month': number,
        'start-day': number,
        'end-year': number,
        'end-month': number,
        'end-day': number,
    }):Observable<{error:any, id: string}> {
        let body = JSON.stringify(info);
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });

        return this.http.post(this.Url+'/add', body, options)
                        .map(this.extractData)
                        .catch(this.handleError);
    }

    public deleteEvent(id: string):Observable<{error:any}> {
        let body = JSON.stringify(id);
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });

        return this.http.post(this.Url+'/delete', body, options)
                        .map(this.extractData)
                        .catch(this.handleError);
    }
}