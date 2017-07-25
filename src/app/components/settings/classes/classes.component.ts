import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { AlertService } from '../../../services/alert.service';
import { AliasService } from '../../../services/alias.service';
import { CanvasService} from '../../../services/canvas.service';
import { contains, capitalize } from '../../../common/utils';
import { ClassesService, Class } from '../../../services/classes.service';
import { PortalService } from '../../../services/portal.service';

@Component({
	selector: 'mymicds-classes',
	templateUrl: './classes.component.html',
	styleUrls: ['./classes.component.scss']
})
export class ClassesComponent implements OnInit, OnDestroy {

	// We need to include this to use in HTML
	private capitalize = capitalize; // tslint:disable-line

	getClassesSubscription: any;
	// If saving classes, prevent user from adding/deleting classes so they don't break anything
	savingClasses = false;
	// List of classes to the database, these classes are binded to form values
	classesList: Class[] = [];
	// Original array of classes from database to compare against new ones
	ogClasses: Class[] = [];
	// Array of class ids to delete if user presses 'Save Changes'
	deleteClassIds: string[] = [];

	getCanvasClassesSubscription: any;
	canvasClasses = [];

	getPortalClassesSubscription: any;
	portalClasses = [];

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

	aliasesSubscription: any;
	aliases = { };

	showAliases = false;
	aliasClass: any = null;

	constructor(
		private alertService: AlertService,
		private aliasService: AliasService,
		private canvasService: CanvasService,
		private classesService: ClassesService,
		private portalService: PortalService
	) { }

	ngOnInit() {
		// Get list of user's classes
		this.getClassesSubscription = this.classesService.getClasses().subscribe(
			classes => {
				this.classesList = classes;
				// Stringify and parse classes so it is a seperate array
				this.ogClasses = JSON.parse(JSON.stringify(classes));
			},
			error => {
				this.alertService.addAlert('danger', 'Classes Error!', error);
			}
		);

		// Get Canvas classes
		this.getCanvasClassesSubscription = this.canvasService.getClasses().subscribe(
			data => {
				if (data.hasURL) {
					this.canvasClasses = data.classes;
				} else {
					this.canvasClasses = [];
				}
			},
			error => {
				this.alertService.addAlert('danger', 'Get Canvas Classes Error!', error);
			}
		);

		// Get Canvas classes
		this.getPortalClassesSubscription = this.portalService.getClasses().subscribe(
			data => {
				if (data.hasURL) {
					this.portalClasses = data.classes;
				} else {
					this.portalClasses = [];
				}
			},
			error => {
				this.alertService.addAlert('danger', 'Get Portal Classes Error!', error);
			}
		);

		// Get Aliases
		this.aliasesSubscription = this.aliasService.listAliases().subscribe(
			aliases => {
				this.aliases = aliases;
			},
			error => {
				this.alertService.addAlert('danger', 'Get Aliases Error!', error);
			}
		);
	}

	ngOnDestroy() {
		this.getClassesSubscription.unsubscribe();
		this.getCanvasClassesSubscription.unsubscribe();
		this.getPortalClassesSubscription.unsubscribe();
	}

	/*
	 * Set Classes
	 */

	// Detect if index of class experienced any changes
	classChanged(id: string) {
		// If class id is empty, then it's a new class and therefore cannot be changed
		if (!id) { return true; }

		// Find class in class list
		let currentClass = null;
		for (let scheduleClass of this.classesList) {
			if (id === scheduleClass._id) {
				currentClass = scheduleClass;
				break;
			}
		}
		if (!currentClass) { return true; }

		// Find original class
		let ogClass = null;
		for (let ogScheduleClass of this.ogClasses) {
			if (id === ogScheduleClass._id) {
				ogClass = ogScheduleClass;
				break;
			}
		}
		if (!ogClass) { return true; }

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
		if (!ogClass) { return; }

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
		let deleteObservables = this.deleteClassIds.map(this.classesService.deleteClass);

		// Reset delete class ids
		this.deleteClassIds = [];

		// Add any new classes
		let saveObservables = this.classesList.map(scheduleClass => {
			if (this.classChanged(scheduleClass._id)) {
				return this.classesService.addClass(scheduleClass);
			}
		}).filter(Boolean); // Remove undefined

		// Combine all of those observables into a MEGA OBSERVABLE
		let deleteClasses$ = Observable.combineLatest(deleteObservables);
		let saveClasses$ = Observable.combineLatest(saveObservables);

		// Only append to MEGA OBSERVABLE if it's actually going to do anything
		let MEGAObservableArray = [];

		if (deleteObservables.length > 0) {
			MEGAObservableArray[0] = deleteClasses$;
		} else {
			MEGAObservableArray[0] = Observable.empty().defaultIfEmpty();
		}

		if (saveObservables.length > 0) {
			MEGAObservableArray[1] = saveClasses$;
		} else {
			MEGAObservableArray[1] = Observable.empty().defaultIfEmpty();
		}

		let MEGAObservable$ = Observable.combineLatest(MEGAObservableArray);

		MEGAObservable$.subscribe(
			(data: any) => {
				// Deleted class logic
				if (data[0] && data[0].length > 0) {
					this.alertService.addAlert('success', 'Success!', 'Deleted ' + data[0].length + ' classes.', 3);
				}

				// Added class logic
				let ids = data[1];
				if (ids && ids.length > 0) {
					this.alertService.addAlert('success', 'Success!', 'Saved ' + ids.length + ' classes.', 3);

					// Go through all classes without ids and insert their new ids
					let idOffset = 0;
					for (let currentClass of this.classesList) {
						if (!currentClass._id) {
							// Assign this new class the next id in the array
							currentClass._id = ids[idOffset++];
						}
					}

				}

				this.ogClasses = JSON.parse(JSON.stringify(this.classesList));
				this.savingClasses = false;
			},
			error => {
				this.alertService.addAlert('danger', 'Save Class Error!', error);
			},
			() => {
				// Get Aliases in case aliases are also deleted along with the class.
				this.aliasesSubscription = this.aliasService.listAliases().subscribe(
					aliases => {
						this.aliases = aliases;
					},
					error => {
						this.alertService.addAlert('danger', 'Get Aliases Error!', error);
					}
				);
			}
		);
	}

	// Adds a class to the bottom
	addClass() {
		// Generate random color
		let color = '#000000'.replace(/0/g,function(){ return (~~(Math.random()*16)).toString(16); }); // tslint:disable-line
		this.classesList.push({
			name: '',
			color: color,
			block: 'other',
			type: 'other',
			teacher: {
				prefix: 'Mr.',
				firstName: '',
				lastName: ''
			}
		});
	}

	deleteClass(i: number) {
		let id = this.classesList[i]._id;
		this.classesList.splice(i, 1);

		// If id is exists, push to array of deleted classes
		if (id) {
			this.deleteClassIds.push(id);
		}
	}

	manageAliases(id: string) {
		// If id is already selected, dismiss
		if (this.aliasClass && id === this.aliasClass._id) {
			this.dismissAliases();
			return;
		}

		// Find class in class list
		for (let scheduleClass of this.classesList) {
			if (id === scheduleClass._id) {
				this.aliasClass = scheduleClass;
				this.showAliases = true;
				return;
			}
		}

		this.dismissAliases();
	}

	dismissAliases() {
		this.showAliases = false;
		this.aliasClass = null;
	}

	// Returns native class id alias belongs to is in, or null if no class
	aliasClassObject(type: string, className: string) {
		// Make sure it's a valid alias type
		if (!contains(this.aliasTypes, type)) { return; }

		for (let alias of this.aliases[type]) {
			if (className === alias.classRemote) {
				return alias;
			}
		}

		return null;
	}

	// Whether alias checkbox should be checked
	aliasChecked(type: string, className: string, classId: string) {
		// Look if class name is in alias
		let aliasClassObject = this.aliasClassObject(type, className);
		// If class name is not in alias, default to enabled
		if (!aliasClassObject) { return false; }
		// If class name is in alias, check whether the it is for this class or another
		return classId === aliasClassObject.classNative;
	}

	// Whether alias checkbox should be disabled
	aliasDisabled(type: string, className: string, classId: string) {
		// Look if class name is in alias
		let aliasClassObject = this.aliasClassObject(type, className);
		// If class name is not in alias, default to enabled
		if (!aliasClassObject) { return false; }
		// If class name is in alias, check whether the it is for this class or another
		return classId !== aliasClassObject.classNative;
	}

	// When the user either checks or unchecks the box
	aliasChange(event, type: string, className: string, classId: string) {
		// Make sure it's a valid alias type
		if (!contains(this.aliasTypes, type)) { return; }

		if (event.target.checked) {
			// Add alias
			this.aliasService.addAlias(type, className, classId).subscribe(
				id => {
					this.alertService.addAlert('success', 'Success!', 'Linked alias to class!', 3);

					// Add alias to aliases array
					this.aliases[type].push({
						_id: id,
						type,
						classNative: classId,
						classRemote: className
					});
				},
				error => {
					this.alertService.addAlert('danger', 'Add Alias Error!', error);
				}
			);
		} else {
			// Delete alias
			let aliasObject = this.aliasClassObject(type, className);
			let aliasId = aliasObject._id;
			this.aliasService.deleteAlias(type, aliasId).subscribe(
				() => {
					this.alertService.addAlert('success', 'Success!', 'Deleted alias from class!', 3);

					// Remove alias from aliases array
					for (let i = 0; i < this.aliases[type].length; i++) {
						if (this.aliases[type][i]._id === aliasId) {
							this.aliases[type].splice(i, 1);
						}
					}
				},
				error => {
					this.alertService.addAlert('danger', 'Delete Alias Error!', error);
				}
			);
		}
	}

}
