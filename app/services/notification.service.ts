import * as config from '../common/config';

import {Injectable, EventEmitter} from '@angular/core';
import {Http, RequestOptions} from '@angular/http';
import {xhrHeaders, handleError} from '../common/http-helpers';
import '../common/rxjs-operators';

@Injectable()
export class NotificationService {
    noteQ: Array<noty> = []
    addNotification(n: noty) {
        this.noteQ.unshift(n)
    }
    getNotifications() {
        return this.noteQ;
    }
}

export interface noty {
    type: string; //there will be a label to indicate the component that sended the notification
    title: string;
    content: string;
    color?: string; //the color indicates the class the noty is associated to
    sticky: boolean;
}