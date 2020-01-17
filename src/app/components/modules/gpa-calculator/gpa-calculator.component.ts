
import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';

@Component({
	selector: 'mymicds-gpa-calculator',
	templateUrl: './gpa-calculator.component.html',
	styleUrls: ['./gpa-calculator.component.scss']
})
export class GpaCalculatorComponent implements OnInit, OnDestroy {

  @ViewChild('moduleContainer', { static: true }) moduleContainer: ElementRef;

  constructor() {}

  ngOnInit() {

  }

  ngOnDestroy() {

  }

}
