import {Injectable, Inject} from '@angular/core';
import {Headers, Http, RequestOptions, Response} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import '../common/rxjs-operators';
import {UserService} from './user.service';

@Injectable()
export class ClassesService {
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

    private Url = 'http://localhost:1420/classes';

    public getClasses():Observable<{error:any, classes:any[]}> {
        let body = null;
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });

        return this.http.post(this.Url+'/get', body, options)
                        .map(this.extractData)
                        .catch(this.handleError);
    }

    public addClass(info: {
        id: string,
        name: string,
        color: string,
        block: string,
        type: string,
        teacher: {
            prefix: string,
            firstName: string,
            lastName: string
        },
    }):Observable<{error:any, id: string}> {
        let body = JSON.stringify(info);
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });

        return this.http.post(this.Url+'/add', body, options)
                        .map(this.extractData)
                        .catch(this.handleError);
    }

    deleteClass(id: string):Observable<{error:any}> {
        let body = JSON.stringify(id);
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });

        return this.http.post(this.Url+'/delete', body, options)
                        .map(this.extractData)
                        .catch(this.handleError);
    }
}