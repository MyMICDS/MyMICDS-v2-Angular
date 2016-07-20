import {Component} from '@angular/core';
import {CanvasService} from '../../services/canvas.service'

@Component({
    templateUrl: 'app/components/Planner/planner.html',
    styleUrls: ['dist/app/components/Planner/planner.css'],
    directives: [],
    providers: []
})

export class PlannerComponent {

    constructor(private canvasService: CanvasService) {}

    ngOnInit() {
        let date = new Date();
        let d = {year: date.getFullYear(), month: date.getMonth()}
        this.canvasService.getEvents(d).subscribe(
            events => {
                console.dir(events)
            },
            error => {
                console.error(error)
            }
        )
    }
}