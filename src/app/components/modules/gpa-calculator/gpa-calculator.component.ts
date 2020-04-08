import { MyMICDS } from '@mymicds/sdk';
import {
	Component,
	ElementRef,
	OnDestroy,
	OnInit,
	ViewChild
} from '@angular/core';
import { SubscriptionsComponent } from '../../../common/subscriptions-component';

@Component({
	selector: 'mymicds-gpa-calculator',
	templateUrl: './gpa-calculator.component.html',
	styleUrls: ['./gpa-calculator.component.scss']
})
export class GpaCalculatorComponent extends SubscriptionsComponent
	implements OnInit, OnDestroy {
	@ViewChild('moduleContainer', { static: true }) moduleContainer: ElementRef;

	displayObjects = [
		{block: 'a', name: 'A Period'},
		{block: 'b', name: 'B Period'},
		{block: 'c', name: 'C Period'},
		{block: 'd', name: 'D Period'},
		{block: 'e', name: 'E Period'},
		{block: 'f', name: 'F Period'},
		{block: 'g', name: 'G Period'}
	];

	// MICDS grading scale starts at F, goes to A. Mappings were retreived from guidebook
	letterGradesArray = [
		'N/A',
		'A',
		'A-',
		'B+',
		'B',
		'B-',
		'C+',
		'C',
		'C-',
		'D+',
		'D',
		'D-',
		'F'
	];

	calculationMappings = {
		'A': 4.0,
		'A-': 3.67,
		'B+': 3.33,
		'B': 3.0,
		'B-': 2.67,
		'C+': 2.33,
		'C': 2.0,
		'C-': 1.67,
		'D+': 1.33,
		'D': 1.0,
		'D-': 0.67,
		'F': 0.0
	};

	dropdownGradeInputs = ['N/A', 'N/A', 'N/A', 'N/A', 'N/A', 'N/A', 'N/A'];
	showOutput = false;
	displayString  = 'Something went wrong!';
	currentCalc = 0;
	validInputs = 0;

	constructor(private mymicds: MyMICDS) {
		super();
	}

	ngOnInit() {
		// create display list of classes, if there's not an alias just call it A, B etc...
		this.mymicds.classes.get().subscribe(response => {
			for (const schoolClass of response.classes) {
					for (const displayObject of this.displayObjects) {

						// if the block/class has an alias name, use the alias name
						if (displayObject.block === schoolClass.block) {
							let displayIndex = this.displayObjects.findIndex(x => x.block === displayObject.block);
							this.displayObjects[displayIndex].name = schoolClass.name;
						}
					}
				}
		});
	}

	ngOnDestroy() {
		this.showOutput = false;
	}

	onSelectionChange() {
		let gradeTotal = 0.0;
		this.validInputs = 0;

		for (const inputGrade of this.dropdownGradeInputs) {
			if (inputGrade !== 'N/A') {
				this.validInputs++;
				gradeTotal += this.calculationMappings[inputGrade];
			}
		}

		// round calc to two decimal places
		this.currentCalc = Math.round((gradeTotal / this.validInputs) * 100) / 100;

		if (this.displayString.substr(this.displayString.length - 1) !== '*') {
			this.displayString += '*';
		}
	}

	calculateGpa() {
		// display the GPA, if it's 4.0, have a party
		this.displayString = (this.currentCalc > 3.99) ? '🎉4.0🎉' : this.currentCalc + '';

		// only show if there is at least 1 valid input (Not N/A).
		this.showOutput = (this.validInputs > 0);
	}

}
