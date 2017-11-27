import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'mymicds-gpa',
	templateUrl: './gpa.component.html',
	styleUrls: ['./gpa.component.scss']
})

export class GpaComponent implements OnInit {

	GRADES = [
		{ id: 0, name: 'Free Period', value: -1 },
		{ id: 1, name: 'A', value: 4  },
		{ id: 2, name: 'A-', value: 3.66  },
		{ id: 3, name: 'B+', value: 3.33  },
		{ id: 4, name: 'B', value: 3  },
		{ id: 5, name: 'B-', value: 2.66  },
		{ id: 6, name: 'C+', value: 2.33  },
		{ id: 7, name: 'C', value: 2  },
		{ id: 8, name: 'C-', value: 1.66  },
		{ id: 9, name: 'D+', value: 1.33  },
		{ id: 10, name: 'D', value: 1  },
		{ id: 11, name: 'D-', value: .66  },
		{ id: 12, name: 'F', value: 0  },
	];

	finalGpa = 3.00;
	selectedGradeValue1 = 3;
	selectedGradeValue2 = 3;
	selectedGradeValue3 = 3;
	selectedGradeValue4 = 3;
	selectedGradeValue5 = 3;
	selectedGradeValue6 = 3;
	selectedGradeValue7 = 3;

	gradeValues = [
		this.selectedGradeValue1,
		this.selectedGradeValue2,
		this.selectedGradeValue3,
		this.selectedGradeValue4,
		this.selectedGradeValue5,
		this.selectedGradeValue6,
		this.selectedGradeValue7
	];


	constructor() { }

	ngOnInit() {
		this.getAverageGrade();
	}

	getAverageGrade() {
		let sum = 0;
		let count = 0;

		for(let possibility = 0; possibility < this.gradeValues.length; possibility++) {
			if(this.gradeValues[possibility] != -1){
				console.log(this.gradeValues[possibility]);
				sum +=	+this.gradeValues[possibility];
				count++;
			}
		}

		if(count == 0){
			this.finalGpa = 0;
		} else {
			this.finalGpa = Math.round((sum / count) * 100) / 100;
		}
	}
}
