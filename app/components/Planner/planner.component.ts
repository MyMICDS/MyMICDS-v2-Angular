import {Component} from '@angular/core';
import {PlannerService} from '../../services/planner.service';
import {ClassesService} from '../../services/classes.service'
import {NgFor, NgIf, NgClass, NgStyle, NgForm} from '@angular/common'

@Component({
    selector: 'planner',
    templateUrl: 'app/components/Planner/planner.html',
    styleUrls: ['dist/app/components/Planner/planner.css'],
    directives: [NgFor, NgIf, NgClass, NgStyle],
    providers: [PlannerService, ClassesService]
})

export class PlannerComponent {

    constructor(private plannerService: PlannerService, private classesService: ClassesService) {}

    public eventsList: Array<Array<any>> = [];
    public classesList: Array<any> = [];
    public selectedEvents = [];
    private date = new Date();
    public currentDate = this.date.getDate();
    public selectedDate = {year: this.date.getFullYear(), month: this.date.getMonth()+1};
    private toggle = false;
    public monthList = [];
    public dateList = [];
    public isAdding = true;

    public reinitialize() {
        this.plannerService.getEvents(this.selectedDate).subscribe(
            eventsInfo => {
                this.eventsList = this.sortEvents(this.pushEvents(eventsInfo.events))
                console.dir(this.eventsList)
            },
            error => {
                console.error(error)
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
        this.reinitialize();
        this.classesService.getClasses().subscribe(
            classesInfo => {
                if (classesInfo.error) {
                    console.log(classesInfo.error)
                } else {
                    this.classesList = classesInfo.classes;
                    console.dir(classesInfo)
                }
            },
            error => console.log(error)
        )
    }

    monthDays(date: Date){
        var d= new Date(date.getFullYear(), date.getMonth()+1, 0);
        return d.getDate();
    }


    private pushEvents(rawEvents: any[]): Array<any> {
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
                    events[l-1].push(rawEvents[k]);
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

    public applyColor(event) {
        if (event.class) {
            return {'background-color': event.class.color}
        } else {
            return {'background-color': 'grey'}
        }
    }

    public eventModel = {
        id: '',
        title: '',
        desc: '',
        'class-id': '',
        'start-year': this.date.getFullYear(),
        'start-month': this.date.getMonth()+1,
        'start-day': this.date.getDate(),
        'end-year': this.date.getFullYear(),
        'end-month': this.date.getMonth()+1,
        'end-day': this.date.getDate(),
    }

    public toggleForm() {
        this.toggle = !this.toggle;
        this.eventModel = {
            id: null,
            title: '',
            desc: '',
            'class-id': '',
            'start-year': this.date.getFullYear(),
            'start-month': this.date.getMonth()+1,
            'start-day': this.date.getDate(),
            'end-year': this.date.getFullYear(),
            'end-month': this.date.getMonth()+1,
            'end-day': this.date.getDate(),
        }
    }

    public addEvent() {
        this.plannerService.addEvent(this.eventModel).subscribe(
            id => {id.error ? console.log(id.error) : console.log('Submitted event id: '+id.id)},
            error => {console.log(error)}
        );
        this.reinitialize();
    }

    public deleteEvent(id:string) {
        this.plannerService.deleteEvent(id).subscribe(
            deleteError => console.log,
            error => console.log
        )
        this.reinitialize();
    }
}