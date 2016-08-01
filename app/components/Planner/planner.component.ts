import {Component} from '@angular/core';
import {NgFor, NgIf, NgClass, NgStyle, NgForm} from '@angular/common';
import {FaDirective} from 'angular2-fontawesome/directives';

import {AlertService} from '../../services/alert.service';
import {ClassesService} from '../../services/classes.service';
import {PlannerService} from '../../services/planner.service';

@Component({
    selector: 'planner',
    templateUrl: 'app/components/Planner/planner.html',
    styleUrls: ['dist/app/components/Planner/planner.css', 'dist/app/styles/loading.css'],
    directives: [NgFor, NgIf, NgClass, NgStyle, FaDirective],
    providers: [PlannerService, ClassesService]
})
export class PlannerComponent {
    constructor(private alertService: AlertService, private classesService: ClassesService, private plannerService: PlannerService) {}

    public eventsList: Array<Array<any>> = [];
    public classesList: Array<any> = [];
    public selectedEvents = [];
    private date = new Date();
    public currentDate = this.date.getDate();
    public selectedDate = {year: this.date.getFullYear(), month: this.date.getMonth()};
    private toggle = false;
    public monthList = [];
    public dateList = [];
    public isAdding = true;
    public plannerMsg: string;
    loading: boolean; //to toggle the loading animations

    public initialize() {
        this.loading = true;
        console.info('refreshing the planner...')
        let selectedDate = {year: this.selectedDate.year, month: this.selectedDate.month+1}
        this.plannerService.getEvents(selectedDate).subscribe(
            eventsInfo => {
                if (eventsInfo) {
                    this.eventsList = this.sortEvents(this.pushEvents(eventsInfo))
                    console.log(this.eventsList)
                }
            },
            error => {
				this.alertService.addAlert('danger', error);
            },
            () => {
                this.loading = false;
            }
        );
        this.toggle = false;
    }

    ngOnInit() {
        for (let i=1;i<=this.monthDays(this.date);i++) {
            this.dateList.push(i)
        }
        for (let i=1;i<=12;i++) {
            let monthStringList = ['January', 'Febuary', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
            this.monthList.push({value: i, string: monthStringList[i-1]})
        }
        this.initialize();
        this.classesService.getClasses().subscribe(
            classesInfo => {
                this.classesList = classesInfo;
            },
            error => {
                this.alertService.addAlert('danger', error);
            }
        )
    }

    monthDays(date: Date){
        var d= new Date(date.getFullYear(), date.getMonth()+1, 0);
        return d.getDate();
    }


    private pushEvents(rawEvents: any[]): Array<any> { //returns an array containing empty arrays for the calendar offset, and arrays with a date object and all the evnents as objects
        let events = [];
        let firstDay = new Date(this.date.getFullYear(), this.date.getMonth(), 1)
        for (let i=0;i<firstDay.getDay();i++) {
            events.push([])//create calendar offset
        };
        for (let j=0;j<this.monthDays(this.date);j++) {
            let l = events.push([{date: j+1}]);
            for (let k=0;k<rawEvents.length;k++) {
                let ESD = new Date(rawEvents[k].start).getDate();
                let EED = new Date(rawEvents[k].end).getDate();
                if (ESD<=j && j<=EED) {
                    events[l-2].push(rawEvents[k]);
                }
            }
        }
        return events
    }

    private sortEvents(pushedEvents: any[]):Array<any> {
        let events = [[],[],[],[],[],[]]; //A month cannot have more than 42 days, right?
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

    public applyColor(event) {
        if (event.class) {
            return {'background-color': event.class.color}
        } else {
            return {'background-color': 'grey'}
        }
    }

//under is all the user action related methods. above is the planner rendering methods

    public eventModel = {
        id: undefined,
        title: '',
        desc: '',
        classId: '',
        startYear: this.date.getFullYear(),
        startMonth: this.date.getMonth()+1,
        startDay: this.date.getDate(),
        endYear: this.date.getFullYear(),
        endMonth: this.date.getMonth()+1,
        endDay: this.date.getDate(),
    }

    public toggleForm() {
        this.isAdding = true;
        this.toggle = !this.toggle;
    }

    public selectDay(events) {
        this.selectedEvents = events;
        this.toggle = false;
        this.isAdding = true;
        if (events[0]) {
            this.eventModel.startDay = events[0].date;
            this.eventModel.endDay = events[0].date;
        }
    }

    public addEvent() {
        this.loading = true;
        console.log(this.eventModel)
        this.plannerService.addEvent(this.eventModel).subscribe(
            id => {
                console.log('Submitted event id: '+id);
            },
            error => {
				this.alertService.addAlert('danger', error);
			},
            () => {
                this.initialize();
            }
        );
    }

    public deleteEvent(id:string) {
        this.loading = true;
        this.plannerService.deleteEvent(id).subscribe(
            () => {
				this.alertService.addAlert('success', 'Successfully deleted event!');
			},
            error => {
				this.alertService.addAlert('danger', error);
			},
            () => {
                this.initialize();
            }
        )
    }

    public bindEvent(event) {
        let ESD = new Date(event.start);
        let EED = new Date(event.end);
        this.eventModel.startYear = ESD.getFullYear();
        this.eventModel.startMonth = ESD.getMonth()+1;
        this.eventModel.startDay = ESD.getDate();
        this.eventModel.endYear = EED.getFullYear();
        this.eventModel.endMonth = EED.getMonth()+1;
        this.eventModel.endDay = EED.getDate();
        this.eventModel.id = event._id;
        this.eventModel.title = event.title;
        this.eventModel.desc = event.desc;
        if (event.class) {this.eventModel.classId = event.class._id;}
        console.log(this.eventModel)
    }

    public selectingMonth = false;

    public onSelectMonth($event: any) {
        if (0<$event && $event<13) {
            this.selectedDate.month = +$event;
            this.initialize();
            this.selectingMonth = false;
        }
    }
}
