import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'mymicds-standards',
  templateUrl: './standards.component.html',
  styleUrls: ['./standards.component.scss']
})
export class StandardsComponent implements OnInit {
          grade1 = "";
          grade2 = "";
          grade3 = "";
          grade4 = "";
          finalgrade = "Grade: ";

	constructor() { }

	ngOnInit() {

	}

          calc() {
                    let gradep1 = 0.35*parseInt(this.grade1) + 0.65*parseInt(this.grade2);
                    let gradep2 = 0;
                    let gradep3 = 0;


                    this.finalgrade = "Grade: " + (Math.round(gradep1*100)/100).toString();

                    if (this.grade3 != "") {
                              gradep2 = 0.35*gradep1 + 0.65*parseInt(this.grade3);
                              this.finalgrade = "Grade: " + (Math.round(gradep2*100)/100).toString();
                    }

                    if (this.grade4 != "") {
                              gradep3 = 0.35*gradep2 + 0.65*parseInt(this.grade4);
                              this.finalgrade = "Grade: " + (Math.round(gradep3*100)/100).toString();
                    }
          }
}
