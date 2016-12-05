/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { SnowdayComponent } from './snowday.component';

describe('SnowdayComponent', () => {
	let component: SnowdayComponent;
	let fixture: ComponentFixture<SnowdayComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ SnowdayComponent ]
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(SnowdayComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
