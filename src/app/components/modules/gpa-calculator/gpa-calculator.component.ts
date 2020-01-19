import { MyMICDS, GetClassesResponse } from '@mymicds/sdk';
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
	displayClassesArray = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
	classes: GetClassesResponse = null;
	// MICDS grading scale starts at F, goes to A. Mappings retreived from guidebook
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
		A: 4.0,
		'A-': 3.67,
		'B+': 3.33,
		B: 3.0,
		'B-': 2.67,
		'C+': 2.33,
		C: 2.0,
		'C-': 1.67,
		'D+': 1.33,
		D: 1.0,
		'D-': 0.67,
		F: 0.0
	};

	inputGrades = ['', '', '', '', '', '', ''];
	hasClickedCalculationButton = false;
	calculationOutputDisplayString = 'Something\'s Broken';

	constructor(private myMicds: MyMICDS) {
		super();
	}

	ngOnInit() {
		// create display list of classes, if there's not an alias just call it A, B etc...
		this.myMicds.classes.get().subscribe(response => {
			this.classes = response;
			for (const periodIndex in this.displayClassesArray) {
				if (this.displayClassesArray[periodIndex] !== undefined) {
					for (const classIndex in this.classes.classes) {
						if (
							this.displayClassesArray[periodIndex].toLowerCase() ===
							this.classes.classes[classIndex].block
						) {
							this.displayClassesArray[periodIndex] = this.classes.classes[
								classIndex
							].name;
						}
					}
				}
			}
		});
		// initialize the dropdowns with 'N/A'
		for (const inputGradeIndex in this.inputGrades) {
			if (this.inputGrades[inputGradeIndex].length === 0) {
				this.inputGrades[inputGradeIndex] = 'N/A';
			}
		}
	}

	ngOnDestroy() {
		this.hasClickedCalculationButton = false;
	}

	calculateGpa() {
		let calculatedGpa = 0.0;
		let numberOfInputs = 0;
		let gradeTotal = 0.0;
		for (const inputGradeIndex in this.inputGrades) {
			if (
				this.inputGrades[inputGradeIndex].length !== 0 &&
				this.inputGrades[inputGradeIndex] !== 'N/A'
			) {
				numberOfInputs++;
				gradeTotal += this.calculationMappings[
					this.inputGrades[inputGradeIndex]
				];
			}
		}
		calculatedGpa = gradeTotal / numberOfInputs;
		if (numberOfInputs > 0) {
			this.hasClickedCalculationButton = true;
			if (calculatedGpa === 4.0) {
				this.calculationOutputDisplayString = '🎉4.0🎉';
			} else {
				this.calculationOutputDisplayString =
					(Math.round(calculatedGpa * 100) / 100) + '';
			}
		}
	}
}
