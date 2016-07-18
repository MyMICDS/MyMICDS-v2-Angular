import {Injectable, Inject} from '@angular/core';
import {Headers, Http, RequestOptions, Response} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import '../common/rxjs-operators';
import {UserService} from './user.service';

@Injectable()
export class PortalService {
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

    private Url = 'http://localhost:1420/portal'
    public getSchedule(date?:any):
    Observable<{
        error: string;
        schedule: {
            day:number,
            classes:{
                start:string;
                end:string;
                name:string;
            }[],
            allDay:string[]
            }}> {
        let body = JSON.stringify(date);
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });

        return this.http.post(this.Url+'/get-schedule', body, options)
                        .map((res) => {
							let data = this.extractData(res);

							// Check of any server-side error
							if(data.error) {
								this.handleError(data.error);
								return;
							}

							let schedule = data.schedule;

							// Convert start and end times into Javascript data objects
							for(let i = 0; i < schedule.classes.length; i++) {
								schedule.classes[i].start = new Date(schedule.classes[i].start);
								schedule.classes[i].end = new Date(schedule.classes[i].end);
							}
							return schedule;
						})
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
