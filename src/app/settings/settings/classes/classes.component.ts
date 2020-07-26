import { AddClassResponse, Block, ClassType, GetClassesResponse, MyMICDS, MyMICDSClass } from '@mymicds/sdk';

import { Component, OnInit } from '@angular/core';
import { combineLatest, Observable } from 'rxjs';
import { defaultIfEmpty } from 'rxjs/operators';
import { capitalize, contains } from '../../../common/utils';

import { SubscriptionsComponent } from '../../../common/subscriptions-component';
import { AlertService } from '../../../services/alert.service';

@Component({
	selector: 'mymicds-classes',
	templateUrl: './classes.component.html',
	styleUrls: ['./classes.component.scss']
})
export class ClassesComponent extends SubscriptionsComponent implements OnInit {

	// We need to include this to use in HTML
	capitalize = capitalize; // tslint:disable-line

	// If saving classes, prevent user from adding/deleting classes so they don't break anything
	savingClasses = false;
	// List of classes to the database, these classes are binded to form values
	classesList: GetClassesResponse['classes'] = [];
	// Original array of classes from database to compare against new ones
	ogClasses: GetClassesResponse['classes'] = [];
	// Array of class ids to delete if user presses 'Save Changes'
	deleteClassIds: string[] = [];

	canvasClasses: string[] = [];
	portalClasses: string[] = [];

	// Set Classes form
	classBlocks = [
		'a',
		'b',
		'c',
		'd',
		'e',
		'f',
		'g',
		'sport',
		'other'
	];
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
	teacherPrefixes = [
		'Mr.',
		'Ms.'
	];

	aliasTypes = [
		'canvas',
		'portal'
	];

	aliasClass: MyMICDSClass | null = null;

	constructor(private mymicds: MyMICDS, private alertService: AlertService) {
		super();
	}

	ngOnInit() {
		// Get list of user's classes
		this.addSubscription(
			this.mymicds.classes.get().subscribe(classes => {
				this.classesList = classes.classes;
				// Stringify and parse classes so it is a seperate array
				this.ogClasses = JSON.parse(JSON.stringify(this.classesList));
			})
		);

		// Get Canvas classes
		this.addSubscription(
			this.mymicds.canvas.getClasses().subscribe(data => {
				if (data.hasURL) {
					this.canvasClasses = data.classes;
				} else {
					this.canvasClasses = [];
				}
			})
		);

		// Get Canvas classes
		this.addSubscription(
			this.mymicds.portal.getClasses().subscribe(data => {
				if (data.hasURL) {
					this.portalClasses = data.classes;
				} else {
					this.portalClasses = [];
				}
			})
		);
	}

	/*
	 * Set Classes
	 */

	// TODO: Clean up some of these for loops into standard Array methods

	// Detect if index of class experienced any changes
	classChanged(id: string) {
		// If class id is empty, then it's a new class and therefore cannot be changed
		if (!id) {
			return true;
		}

		// Find class in class list
		let currentClass = null;
		for (let scheduleClass of this.classesList) {
			if (id === scheduleClass._id) {
				currentClass = scheduleClass;
				break;
			}
		}
		if (!currentClass) {
			return true;
		}

		// Find original class
		let ogClass = null;
		for (let ogScheduleClass of this.ogClasses) {
			if (id === ogScheduleClass._id) {
				ogClass = ogScheduleClass;
				break;
			}
		}
		if (!ogClass) {
			return true;
		}

		return currentClass.name !== ogClass.name
			|| currentClass.color !== ogClass.color
			|| currentClass.block !== ogClass.block
			|| currentClass.type !== ogClass.type
			|| currentClass.teacher.prefix !== ogClass.teacher.prefix
			|| currentClass.teacher.firstName !== ogClass.teacher.firstName
			|| currentClass.teacher.lastName !== ogClass.teacher.lastName;
	}

	// Detect of any class has changed
	anyClassChanged() {
		let anyChanged = false;
		for (let scheduleClass of this.classesList) {
			if (this.classChanged(scheduleClass._id)) {
				anyChanged = true;
				break;
			}
		}
		return anyChanged;
	}

	// Detects if a class was added
	anyClassAdded() {
		let ogIds = this.ogClasses.map(ogClass => ogClass._id);
		let anyAdded = false;

		for (let scheduleClass of this.classesList) {
			// Check if there's an id that's in the table that isn't in the original
			if (!contains(ogIds, scheduleClass._id)) {
				anyAdded = true;
				break;
			}
		}
		return anyAdded;
	}

	// Detects if a class was deleted
	anyClassDeleted() {
		let ids = this.classesList.map(scheduleClass => scheduleClass._id);
		let anyDeleted = false;

		for (let ogClass of this.ogClasses) {
			// Check if there's an id that's in the original that isn't in the table
			if (!contains(ids, ogClass._id)) {
				anyDeleted = true;
				break;
			}
		}
		return anyDeleted;
	}

	// Restore a class of a certain index
	restoreClass(id: string) {
		// Find original class
		let ogClass = null;
		for (let ogScheduleClass of this.ogClasses) {
			if (id === ogScheduleClass._id) {
				ogClass = JSON.parse(JSON.stringify(ogScheduleClass));
				break;
			}
		}
		if (!ogClass) {
			return;
		}

		// Find class in class list
		for (let scheduleClass of this.classesList) {
			if (id === scheduleClass._id) {
				scheduleClass = ogClass;
			}
		}
	}

	// Save any class that has been changed
	saveClasses() {
		this.savingClasses = true;

		// Delete any old classes
		let deleteObservables = this.deleteClassIds.map(id => this.mymicds.classes.delete({ id }, true));

		// Reset delete class ids
		this.deleteClassIds = [];

		// Add any new classes
		let saveObservables = this.classesList.map(scheduleClass => {
			if (this.classChanged(scheduleClass._id)) {
				return this.mymicds.classes.add({
					id: scheduleClass._id,
					name: scheduleClass.name,
					color: scheduleClass.color,
					block: scheduleClass.block,
					type: scheduleClass.type,
					teacherPrefix: scheduleClass.teacher.prefix,
					teacherFirstName: scheduleClass.teacher.firstName,
					teacherLastName: scheduleClass.teacher.lastName
				}, true);
			}
		}).filter(Boolean) as unknown as Observable<AddClassResponse>[];

		// Combine all of those observables into a MEGA OBSERVABLE
		let deleteClasses$ = combineLatest(deleteObservables).pipe(defaultIfEmpty());
		let saveClasses$ = combineLatest(saveObservables).pipe(defaultIfEmpty());
		let MEGAObservable$ = combineLatest([deleteClasses$, saveClasses$]);

		MEGAObservable$.subscribe(([deleted, saved]) => {
			// Deleted class logic
			if (deleted && deleted.length > 0) {
				this.alertService.addSuccess(`Deleted ${deleted.length} classes.`);
			}

			// Added class logic
			if (saved && saved.length > 0) {
				this.alertService.addSuccess(`Saved ${saved.length} classes.`);

				// Go through all classes without ids and insert their new ids
				let idOffset = 0;
				for (let currentClass of this.classesList) {
					if (!currentClass._id) {
						// Assign this new class the next id in the array
						currentClass._id = saved[idOffset++].id;
					}
				}

			}

			this.ogClasses = JSON.parse(JSON.stringify(this.classesList));
			this.savingClasses = false;
		}, () => {
			this.savingClasses = false;
		});
	}

	// Adds a class to the bottom
	addClass() {
		// Generate random color
		let color = '#000000'.replace(/0/g, () => (~~(Math.random() * 16)).toString(16)); // tslint:disable-line
		this.classesList.push({
			name: '',
			color: color,
			block: Block.OTHER,
			type: ClassType.OTHER,
			teacher: {
				prefix: 'Mr.',
				firstName: '',
				lastName: ''
			}
		} as MyMICDSClass);
	}

	deleteClass(i: number) {
		let id = this.classesList[i]._id;
		this.classesList.splice(i, 1);

		// If id is exists, push to array of deleted classes
		if (id) {
			this.deleteClassIds.push(id);
		}
	}

}
