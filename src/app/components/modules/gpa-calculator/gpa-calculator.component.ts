import { MyMICDS, GetClassesResponse } from '@mymicds/sdk';
import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { SubscriptionsComponent } from '../../../common/subscriptions-component';

@Component({
	selector: 'mymicds-gpa-calculator',
	templateUrl: './gpa-calculator.component.html',
	styleUrls: ['./gpa-calculator.component.scss']
})
export class GpaCalculatorComponent extends SubscriptionsComponent implements OnInit, OnDestroy {

  @ViewChild('moduleContainer', { static: true }) moduleContainer: ElementRef;
	displayClassesArray = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
	classes: GetClassesResponse = null;

	getClassArray() {

	}

	constructor(private myMicds: MyMICDS) {
		super();
	}

	ngOnInit() {
		this.myMicds.classes.get().subscribe(response => {
			this.classes = response;

			for (const periodIndex in this.displayClassesArray) {
				for (const classIndex in this.classes.classes) {
				 if (this.displayClassesArray[periodIndex].toLowerCase() === this.classes.classes[classIndex].block) {
					 this.displayClassesArray[periodIndex] = this.classes.classes[classIndex].name
				 }
			 }
			}
			console.log(this.displayClassesArray);
		});
	}

  ngOnDestroy() {

  }



}
