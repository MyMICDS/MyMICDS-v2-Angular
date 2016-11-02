import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';

import { FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import '../../common/rxjs-operators';
import { confirmPassword, confirmGrade } from '../../common/form-validation';
import { contains, capitalize } from '../../common/utils';

import { AlertService } from '../../services/alert.service';
import { AliasService } from '../../services/alias.service';
import { AuthService } from '../../services/auth.service';
import { BackgroundService } from '../../services/background.service';
import { CanvasService} from '../../services/canvas.service';
import { ClassesService, Class } from '../../services/classes.service';
import { PortalService } from '../../services/portal.service';
import { UserService } from '../../services/user.service';

@Component({
	selector: 'mymicds-settings',
	templateUrl: './settings.component.html',
	styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit, AfterViewInit, OnDestroy {

	// We need to include this to use in HTML
	private capitalize = capitalize; // tslint:disable-line

	// Changed by the forms
	userInfo: any = null;
	// Array of graduation years
	gradeRangeSubscription: any;
	gradeRange: number[];

	// Change info form
	infoForm: any = null;
	passwordForm: any = this.formBuilder.group({
		oldPassword: ['', Validators.required],
		newPassword: ['', Validators.required],
		confirmPassword: ['', Validators.required]
	}, { validator: confirmPassword('newPassword', 'confirmPassword') });

	userSubscription: any;

	// Canvas URL Form
	canvasURLSubscription: any;
	canvasURL: string;
	canvasValid: boolean;
	canvasResponse: string;

	// Portal URL Form
	portalURLSubscription: any;
	portalURL: string;
	portalValid: boolean;
	portalResponse: string;

	// Background Upload Form
	hasDefaultBackground = true;
	fileSelected = false;
	uploadingBackground = false;

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

	aliasTypes = [
		'canvas',
		'portal'
	];

	aliasesSubscription: any;
	aliases = { };

	showAliases = false;
	aliasClass: any = null;

	constructor(
		private formBuilder: FormBuilder,
		private alertService: AlertService,
		private aliasService: AliasService,
		private authService: AuthService,
		private backgroundService: BackgroundService,
		private canvasService: CanvasService,
		private classesService: ClassesService,
		private portalService: PortalService,
		private userService: UserService
	) {
		this.backgroundService.get().subscribe(
			data => {
				this.hasDefaultBackground = data.hasDefault;
			},
			error => {
				this.alertService.addAlert('danger', 'Get Background Error!', error);
			}
		);
	}

	ngOnInit() {
		// Get basic info
		this.userSubscription = this.userService.getInfo().subscribe(
			data => {
				this.userInfo = data;

				// Prefill user data in forms
				this.infoForm = this.formBuilder.group({
					firstName: [this.userInfo.firstName, Validators.required],
					lastName: [this.userInfo.lastName, Validators.required],
					gradYear: [this.userInfo.gradYear],
					teacher: [this.userInfo.gradYear === null]
				}, { validator: confirmGrade('gradYear', 'teacher') });

				// Get URL's
				this.portalURL = this.userInfo.portalURL;
				this.canvasURL = this.userInfo.canvasURL;

				if (this.portalURL) {
					this.portalValid = true;
					this.portalResponse = 'Valid!';
				}
				if (this.canvasURL) {
					this.canvasValid = true;
					this.canvasResponse = 'Valid!';
				}
			},
			error => {
				this.alertService.addAlert('danger', 'Settings Error!', error);
			}
		);

		// Get graduation year range
		this.gradeRangeSubscription = this.userService.gradeRange().subscribe(
			gradeRange => {
				this.gradeRange = gradeRange;
			},
			error => {
				this.alertService.addAlert('danger', 'Settings Error!', error);
			}
		);

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

	ngAfterViewInit() {

		/*
		 * @TODO
		 * This is, yet again, one of those things that I can't get to work no matter what I try.
		 * The ngAfterViewInit lifecycle hook _should_ have loaded the DOM, but the input variables return null.
		 * I even put a setTimeout of 1000, and they still return null.
		 * The only way I've found is to have an interval, which the DOM elements are retrieved
		 * always on the second time.
		 */

		let interval = setInterval(() => {

			// Get URL inputs
			let portalInput = document.getElementById('portal-url');
			let canvasInput = document.getElementById('canvas-url');

			// Keep trying until DOM is loaded
			if (!portalInput || !canvasInput) { return; }
			clearInterval(interval);

			// Subscribe to Portal and Canvas URL inputs to test URL
			this.portalURLSubscription = Observable.fromEvent(portalInput, 'keyup')
				.debounceTime(250)
				.switchMap(() => {
					this.portalValid = false;
					this.portalResponse = 'Validating...';
					return this.portalService.testURL(this.portalURL)
				})
				.subscribe(
					data => {
						this.portalValid = (data.valid === true);
						this.portalResponse = (data.valid === true) ? 'Valid!' : data.valid;
					},
					error => {
						this.alertService.addAlert('warning', 'Test Portal URL Error!', error);
					}
				);

			this.canvasURLSubscription = Observable.fromEvent(canvasInput, 'keyup')
				.debounceTime(250)
				.switchMap(() => {
					this.canvasValid = false;
					this.canvasResponse = 'Validating...';
					return this.canvasService.testURL(this.portalURL)
				})
				.subscribe(
					data => {
						this.canvasValid = (data.valid === true);
						this.canvasResponse = (data.valid === true) ? 'Valid!' : data.valid;
					},
					error => {
						this.alertService.addAlert('warning', 'Test Canvas URL Error!', error);
					}
				);
		}, 1);
	}

	ngOnDestroy() {
		// Unsubscribe to prevent memory leaks or something
		this.userSubscription.unsubscribe();
		this.gradeRangeSubscription.unsubscribe();

		this.portalURLSubscription.unsubscribe();
		this.canvasURLSubscription.unsubscribe();

		this.getClassesSubscription.unsubscribe();
		this.getCanvasClassesSubscription.unsubscribe();
		this.getPortalClassesSubscription.unsubscribe();
	}

	valueChanged(): boolean {

		// Find out if grade changed
		let userInfoIsTeacher = (this.userInfo.gradYear === null);
		let infoFormIsTeacher = this.infoForm.controls.teacher.value;

		let userInfoGradYear = this.userInfo.gradYear;
		let infoFormGradYear = !infoFormIsTeacher ? parseInt(this.infoForm.controls.gradYear.value, 10) : null;

		let gradeChanged = false;

		if (userInfoIsTeacher !== infoFormIsTeacher) {
			// Switched from teacher to student or vice versa
			gradeChanged = true;
		} else if (userInfoGradYear !== infoFormGradYear) {
			// Swtiched grades as a student
			gradeChanged = true;
		}

		return gradeChanged
			|| (this.userInfo.firstName !== this.infoForm.controls.firstName.value)
			|| (this.userInfo.lastName !== this.infoForm.controls.lastName.value);
	}

	canDeactivate(): Observable<boolean> | boolean {
		if (!this.valueChanged()) { return true; }

		let p = new Promise<boolean>((res: (boolean) => void, rej: () => void) => {
			window.confirm('Looks like you have some unsaved settings. Are you sure you wanna leave?') ?
			res(true) : res(false);
		});

		return Observable.fromPromise(p);
	}

	/*
	 * Change General Info
	 */

	changeInfo() {
		// Create new info object
		let newInfo = {
			firstName: this.infoForm.controls.firstName.value,
			lastName: this.infoForm.controls.lastName.value,
			gradYear: this.infoForm.controls.gradYear.value,
			teacher: this.infoForm.controls.teacher.value
		};

		// Set new values to the userInfo
		this.userInfo.firstName = newInfo.firstName;
		this.userInfo.lastName = newInfo.lastName;
		this.userInfo.gradYear = !newInfo.teacher ? parseInt(newInfo.gradYear, 10) : null;

		this.userService.changeInfo(newInfo).subscribe(
			() => {
				this.alertService.addAlert('success', 'Success!', 'Info change successful!', 3);
			},
			error => {
				this.alertService.addAlert('danger', 'Change Info Error!', error);
			}
		);
	}

	/*
	 * Change Password
	 */

	changePassword() {
		this.authService.changePassword(this.passwordForm.controls.oldPassword.value, this.passwordForm.controls.newPassword.value).subscribe(
			() => {
				this.alertService.addAlert('success', 'Success!', 'Password change successful!', 3);
			},
			error => {
				this.alertService.addAlert('danger', 'Password Change Error!', error);
			}
		);
	}

	/*
	 * Portal / Canvas URLs
	 */

	changePortalURL() {
		this.portalService.setURL(this.portalURL).subscribe(
			data => {
				this.portalValid = (data.valid === true);
				this.portalResponse = (data.valid === true) ? 'Valid!' : data.valid;
				if (data.valid === true) {
					this.alertService.addAlert('success', 'Success!', 'Changed Portal URL!', 3);
				} else {
					this.alertService.addAlert('warning', 'Change Portal URL Warning:', data.valid);
				}
			},
			error => {
				this.alertService.addAlert('danger', 'Change Portal URL Error!', error);
			}
		);
	}

	changeCanvasURL() {
		this.canvasService.setURL(this.canvasURL).subscribe(
			data => {
				this.canvasValid = (data.valid === true);
				this.canvasResponse = (data.valid === true) ? 'Valid!' : data.valid;
				if (data.valid === true) {
					this.alertService.addAlert('success', 'Success!', 'Changed Canvas URL!', 3);
				} else {
					this.alertService.addAlert('warning', 'Change Canvas URL Warning:', data.valid);
				}
			},
			error => {
				this.alertService.addAlert('danger', 'Change Canvas URL Error!', error);
			}
		);
	}

	/*
	 * Change Background
	 */

	backgroundFileChange() {
		this.fileSelected = true;
	}

	uploadBackground($event) {
		this.uploadingBackground = true;

		let fileInput: any = document.getElementById('upload-background');
		let FileList: FileList = fileInput.files;
		let file: File = FileList[0];

		this.backgroundService.upload(file).subscribe(
			() => {
				this.uploadingBackground = false;
				this.alertService.addAlert('success', 'Success!', 'Uploaded background!', 3);
				this.backgroundService.get().subscribe(
					data => {
						this.hasDefaultBackground = data.hasDefault;
					},
					error => {
						this.alertService.addAlert('danger', 'Get Background Error!', error);
					}
				);
			},
			error => {
				this.uploadingBackground = false;
				this.alertService.addAlert('danger', 'Upload Background Error!', error);
			}
		);
	}

	deleteBackground() {
		this.backgroundService.delete().subscribe(
			() => {
				this.alertService.addAlert('success', 'Success!', 'Deleted background!', 3);
				this.backgroundService.get().subscribe(
					data => {
						this.hasDefaultBackground = data.hasDefault;
					},
					error => {
						this.alertService.addAlert('danger', 'Get Background Error!', error);
					}
				);
			},
			error => {
				this.alertService.addAlert('danger', 'Delete Background Error!', error);
			}
		);
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
		for (let i = 0; i < this.classesList.length; i++) {
			if (id === this.classesList[i]._id) {
				currentClass = this.classesList[i];
				break;
			}
		}
		if (!currentClass) { return true; }

		// Find original class
		let ogClass = null;
		for (let i = 0; i < this.ogClasses.length; i++) {
			if (id === this.ogClasses[i]._id) {
				ogClass = this.ogClasses[i];
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
		for (let i = 0; i < this.classesList.length; i++) {
			if (this.classChanged(this.classesList[i]._id)) {
				anyChanged = true;
				break;
			}
		}
		return anyChanged;
	}

	// Detects if a class was added
	anyClassAdded() {
		let ogIds = [];
		let anyAdded = false;
		for (let i = 0; i < this.ogClasses.length; i++) {
			ogIds.push(this.ogClasses[i]._id);
		}

		for (let i = 0; i < this.classesList.length; i++) {
			let id = this.classesList[i]._id;

			// Check if there's an id that's in the table that isn't in the original
			if (!contains(ogIds, id)) {
				anyAdded = true;
				break;
			}
		}
		return anyAdded;
	}

	// Detects if a class was deleted
	anyClassDeleted() {
		let ids = [];
		let anyDeleted = false;
		for (let i = 0; i < this.classesList.length; i++) {
			ids.push(this.classesList[i]._id);
		}

		for (let i = 0; i < this.ogClasses.length; i++) {
			let ogId = this.ogClasses[i]._id;

			// Check if there's an id that's in the original that isn't in the table
			if (!contains(ids, ogId)) {
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
		for (let i = 0; i < this.ogClasses.length; i++) {
			if (id === this.ogClasses[i]._id) {
				ogClass = JSON.parse(JSON.stringify(this.ogClasses[i]));
				break;
			}
		}
		if (!ogClass) { return; }

		// Find class in class list
		for (let i = 0; i < this.classesList.length; i++) {
			if (id === this.classesList[i]._id) {
				this.classesList[i] = ogClass;
			}
		}
	}

	// Save any class that has been changed
	saveClasses() {
		this.savingClasses = true;

		// Delete any old classes
		let deleteObservables = [];
		for (let i = 0; i < this.deleteClassIds.length; i++) {
			deleteObservables.push(this.classesService.deleteClass(this.deleteClassIds[i]));
		}

		// Reset delete class ids
		this.deleteClassIds = [];

		// Add any new classes
		let saveObservables = [];
		for (let i = 0; i < this.classesList.length; i++) {
			let id = this.classesList[i]._id;
			// If class changed, push
			if (this.classChanged(id)) {
				saveObservables.push(this.classesService.addClass(this.classesList[i]));
			}
		}

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
					for (let i = 0; i < this.classesList.length; i++) {

						let currentClass = this.classesList[i];
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
		for (let i = 0; i < this.classesList.length; i++) {
			if (id === this.classesList[i]._id) {
				this.aliasClass = this.classesList[i];
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

		let aliases = this.aliases[type];
		for (let i = 0; i < aliases.length; i++) {
			let alias = aliases[i];

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

	setTrianglify() {
		this.uploadingBackground = true;
		this.backgroundService.setTrianglify().subscribe(
			() => {
				this.uploadingBackground = false;
				this.alertService.addAlert('success', 'Success!', 'Uploaded background!', 3);
				this.backgroundService.get().subscribe(
					data => {
						this.hasDefaultBackground = data.hasDefault;
					},
					error => {
						this.alertService.addAlert('danger', 'Get Background Error!', error);
					}
				);
			},
			error => {
				this.uploadingBackground = false;
				this.alertService.addAlert('danger', 'Upload Background Error!', error);
			}
		);
	}

}
