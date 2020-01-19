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
	displayClassesArray = ['A Period', 'B Period', 'C Period', 'D Period', 'E Period', 'F Period', 'G Period'];
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
	calculationOutputDisplayString = 'Something\'s Broken';

	constructor(private mymicds: MyMICDS) {
		super();
	}

	ngOnInit() {
		// create display list of classes, if there's not an alias just call it A, B etc...
		this.mymicds.classes.get().subscribe(response => {
			for (const periodIndex in this.displayClassesArray) {
				if (this.displayClassesArray[periodIndex] !== undefined) {
					for (const schoolClass of response.classes) {
						if (
							this.displayClassesArray[periodIndex][0].toLowerCase() ===
							schoolClass.block
						) {
							this.displayClassesArray[periodIndex] = schoolClass.name;
						}
					}
				}
			}
		});
	}

	ngOnDestroy() {
		this.showOutput = false;
	}

	calculateGpa() {
		let calculatedGpa = 0.0;
		let numberOfInputs = 0;
		let gradeTotal = 0.0;
		for (const inputGrade of this.dropdownGradeInputs) {
			if (
				inputGrade.length !== 0 &&
				inputGrade !== 'N/A'
			) {
				numberOfInputs++;
				gradeTotal += this.calculationMappings[
					inputGrade
				];
			}
		}
		calculatedGpa = gradeTotal / numberOfInputs;
		if (numberOfInputs > 0) {
			this.showOutput = true;
			if (calculatedGpa > 3.99) {
				this.calculationOutputDisplayString = '🎉4.0🎉';
			} else {
				this.calculationOutputDisplayString =
					(Math.round(calculatedGpa * 100) / 100) + '';
			}
		}
	}
}
