import { MyMICDS, GetClassesResponse } from '@mymicds/sdk';
import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { SubscriptionsComponent } from '../../../common/subscriptions-component';
enum LetterGrade { // MICDS grading scale starts at F, goes to A.
	A = 'A',
	A_MINUS = 'A-',
	B_PLUS  = 'B+',
	B = 'B',
	B_MINUS = 'B-',
	C_PLUS = 'C+',
	C = 'C',
	C_MINUS = 'C-',
	D_PLUS = 'D+',
	D = 'D',
	D_MINUS = 'D-',
	F = 'F',
	NA = 'N/A'
}



@Component({
	selector: 'mymicds-gpa-calculator',
	templateUrl: './gpa-calculator.component.html',
	styleUrls: ['./gpa-calculator.component.scss']
})
export class GpaCalculatorComponent extends SubscriptionsComponent implements OnInit, OnDestroy {

  @ViewChild('moduleContainer', { static: true }) moduleContainer: ElementRef;
	displayClassesArray = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
	classes: GetClassesResponse = null;
	letterGradesArray = ['A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D+', 'D', 'D-', 'F', 'N/A'];
	thing = null
	classTypes = [
		'art',
		'english',
		'history',
		'math',
		'science',
		'spanish',
		'latin',
		'mandarin',
		'german',
		'french',
		'other'
	];
	constructor(private myMicds: MyMICDS) {
		super();
	}


	ngOnInit() {
		// create display list of classes, if there's not an alias just call it A, B etc...
		this.myMicds.classes.get().subscribe(response => {
			this.classes = response;
			for (const periodIndex in this.displayClassesArray) {
				if (this.displayClassesArray[periodIndex] !== undefined ) {
				for (const classIndex in this.classes.classes) {
					if (this.displayClassesArray[periodIndex].toLowerCase() === this.classes.classes[classIndex].block) {
						this.displayClassesArray[periodIndex] = this.classes.classes[classIndex].name
				 	}
			 	}
		 		}
	 	}
		});

	}

  ngOnDestroy() {

  }



}
