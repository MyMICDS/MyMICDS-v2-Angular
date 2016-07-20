import {Component} from '@angular/core';
import {PlannerService} from '../../services/planner.service';
import {NgFor, NgIf, NgClass} from '@angular/common'

@Component({
    templateUrl: 'app/components/Planner/planner.html',
    styleUrls: ['dist/app/components/Planner/planner.css'],
    directives: [NgFor, NgIf, NgClass],
    providers: [PlannerService]
})

export class PlannerComponent {

    constructor(private plannerService: PlannerService) {}

    public eventsList: Array<Array<any>> = []

    ngOnInit() {
        let date = new Date();
        let d = {year: date.getFullYear(), month: date.getMonth()+1}
        console.log(d);
        this.plannerService.getEvents(d).subscribe(
            eventsInfo => {
                console.dir(eventsInfo)
                this.eventsList = this.sortEvents(this.pushEvents(eventsInfo.events))
                console.dir(this.eventsList)
            },
            error => {
                console.error(error)
            }
        )
    }

    monthDays(date: Date){
        var d= new Date(date.getFullYear(), date.getMonth()+1, 0);
        return d.getDate();
    }


    private pushEvents(rawEvents: any[]): Array<any> {
        let events = [];
        let date = new Date();
        for (let i=0;i<date.getDay();i++) {
            events.push([{}])
        };//create calendar offset
        for (let j=0;j<this.monthDays(date);j++) {
            let l = events.push([{date: j+1}]);
            for (let k=0;k<rawEvents.length;k++) {
                let ESD = new Date(rawEvents[k].start).getDate();
                let EED = new Date(rawEvents[k].end).getDate();
                if (ESD<=j && j<=EED) {
                    events[l-1].push(rawEvents[k]);
                    console.log(rawEvents[k])
                }
            }
        }
        return events
    }

    private sortEvents(pushedEvents: any[]):Array<any> {
        let events:any[] = [[],[],[],[],[],[]]; //A month cannot have more than 42 days, right?
        let j = 0;
        for (let i=0;i<pushedEvents.length;i++) {
            events[j].push(pushedEvents[i]);
            if ((i+1)%7==0 && j<7) {j++}
        }
        return events;
    }

    private eventChecker(Li: number, Ri: number, Ei: number){
        let eventId = this.eventsList[Li][Ri][Ei]._id;
        let yes: boolean, tom: boolean;
            if (Ri == 0 && Li > 0) {
                let yesEvents = this.eventsList[Li-1][6];
                let tomEvents = this.eventsList[Li][1];
                let yesLength = yesEvents ? yesEvents.length : 0;
                let tomLength = tomEvents ? tomEvents.length : 0;
                for (let i=0;i<yesLength;i++) {
                    if (yesEvents[i]._id === eventId) {
                        yes = true;
                        break
                    }
                };
                for (let i=0;i<tomLength;i++) {
                    if (tomEvents[i]._id === eventId) {
                        tom = true;
                        break
                    }
                };
            } else if (Ri == 6) {
                let yesEvents = this.eventsList[Li][5];
                let tomEvents = this.eventsList[Li+1][0];
                let yesLength = yesEvents ? yesEvents.length : 0;
                let tomLength = tomEvents ? tomEvents.length : 0;
                for (let i=0;i<yesLength;i++) {
                    if (yesEvents[i]._id === eventId) {
                        yes = true;
                        break
                    }
                };
                for (let i=0;i<tomLength;i++) {
                    if (tomEvents[i]._id === eventId) {
                        tom = true;
                        break
                    }
                };
            } else {
                let yesEvents = this.eventsList[Li][Ri-1];
                let tomEvents = this.eventsList[Li][Ri+1];
                let yesLength = yesEvents ? yesEvents.length : 0;
                let tomLength = tomEvents ? tomEvents.length : 0;
                for (let i=0;i<yesLength;i++) {
                    if (yesEvents[i]._id === eventId) {
                        yes = true;
                        break
                    }
                };
                for (let i=0;i<tomLength;i++) {
                    if (tomEvents[i]._id === eventId) {
                        tom = true;
                        break
                    }
                };
            }
        let state = yes && tom ? 3 : yes ? 1 : tom ? 2 : 0
        return {
            extendNone: state == 0,
            extendLeft: state == 1,
            extendRight: state == 2,
            extendBoth: state == 3
        }
        //0 is no events yesterday or tomorrow, 1 is yesterday has the same event, 2 is tomorrow has the same event, 3 is both has the same event
    }
}