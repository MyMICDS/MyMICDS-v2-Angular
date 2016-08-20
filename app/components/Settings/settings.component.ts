import * as config from '../../common/config'

import {Component} from '@angular/core';
import {NgFor, NgIf, NgForm, NgStyle} from '@angular/common';
import {ROUTER_DIRECTIVES} from '@angular/router';
import {REACTIVE_FORM_DIRECTIVES, FormBuilder, Validators} from '@angular/forms';
import {Observable} from 'rxjs/Observable';
import '../../common/rxjs-operators';
import {FaComponent} from 'angular2-fontawesome/components';
import {confirmPassword, confirmGrade} from '../../common/form-validation';
import {contains, capitalize} from '../../common/utils';

import {BlurDirective} from '../../directives/blur.directive';

import {AlertService} from '../../services/alert.service';
import {AuthService} from '../../services/auth.service';
import {BackgroundService} from '../../services/background.service';
import {CanvasService} from '../../services/canvas.service';
import {PortalService} from '../../services/portal.service';
import {UserService} from '../../services/user.service';
import {ClassesService, Class} from '../../services/classes.service';
import {AliasService} from '../../services/alias.service'

import {ColorPickerService} from 'ct-angular2-color-picker/component';
import {ColorPickerDirective} from 'ct-angular2-color-picker/component'

@Component ({
	selector: 'settings',
	templateUrl: 'app/components/Settings/settings.html',
	styleUrls: ['dist/app/components/Settings/settings.css'],
	directives: [ROUTER_DIRECTIVES, REACTIVE_FORM_DIRECTIVES, NgFor, NgIf, NgStyle, FaComponent, BlurDirective, ColorPickerDirective],
	providers: [ClassesService, ColorPickerService, AliasService]
})

export class SettingsComponent {
	constructor(private formBuilder: FormBuilder, private alertService: AlertService, private authService: AuthService, private backgroundService: BackgroundService, private canvasService: CanvasService, private portalService: PortalService, private userService: UserService, private classesService: ClassesService, private aliasService:AliasService) {
		this.backgroundService.get().subscribe(
			data => {
				this.hasDefaultBackground = data.hasDefault;
			},
			error => {
				this.alertService.addAlert('danger', 'Get Background Error!', error);
			}
		);
	}
	capitalize = capitalize;

	// Changed by the forms
	userInfo:any = null;
	// Array of graduation years
	gradeRangeSubscription:any;
	gradeRange:number[];

	// Change info form
	infoForm:any = null;
	passwordForm:any = this.formBuilder.group({
		oldPassword: ['', Validators.required],
		newPassword: ['', Validators.required],
		confirmPassword: ['', Validators.required]
	}, { validator: confirmPassword('newPassword', 'confirmPassword') });

	userSubscription:any;

	// Canvas URL Form
	canvasURLSubscription:any;
	canvasURL:string;
	canvasValid:boolean;
	canvasResponse:string;

	// Portal URL Form
	portalURLSubscription:any;
	portalURL:string;
	portalValid:boolean;
	portalResponse:string;

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

	getClassesSubscription:any;
	// List of classes to the database, these classes are binded to form values
	classesList:Class[] = [];
	// Original array of classes from database to compare against new ones
	ogClasses:Class[] = [];
	// Array of class ids to delete if user presses 'Save Changes'
	deleteClassIds:string[] = [];

	getCanvasClassesSubscription:any;
	canvasClasses = [];

	getPortalClassesSubscription:any;
	portalClasses = [];

	aliasesSubscription:any;
	aliases = [];

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

				if(this.portalURL) {
					this.portalValid = true;
					this.portalResponse = 'Valid!';
				}
				if(this.canvasURL) {
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
				if(data.hasURL) {
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
				if(data.hasURL) {
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
			if(!portalInput || !canvasInput) return;
			clearInterval(interval);

			// Subscribe to Portal and Canvas URL inputs to test URL
			this.portalURLSubscription = Observable.fromEvent(portalInput, 'keyup')
				.switchMap(() => this.portalService.testURL(this.portalURL))
				.debounceTime(250)
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
				.switchMap(() => this.canvasService.testURL(this.canvasURL))
				.debounceTime(250)
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

	valueChanged():boolean {

		// Find out if grade changed
		let userInfoIsTeacher = (this.userInfo.gradYear === null);
		let infoFormIsTeacher = this.infoForm.controls.teacher.value;

		let userInfoGradYear = this.userInfo.gradYear;
		let infoFormGradYear = !infoFormIsTeacher ? parseInt(this.infoForm.controls.gradYear.value) : null;

		let gradeChanged = false;

		if(userInfoIsTeacher !== infoFormIsTeacher) {
			// Switched from teacher to student or vice versa
			gradeChanged = true;
		} else if(userInfoGradYear !== infoFormGradYear) {
			// Swtiched grades as a student
			gradeChanged = true;
		}

		return gradeChanged
			|| (this.userInfo.firstName !== this.infoForm.controls.firstName.value)
			|| (this.userInfo.lastName !== this.infoForm.controls.lastName.value);
	}

	canDeactivate():Observable<boolean> | boolean {
		if (!this.valueChanged()) return true;

		let p = new Promise<boolean>((res: (boolean)=>void, rej: ()=>void) => {
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
		this.userInfo.gradYear = !newInfo.teacher ? parseInt(newInfo.gradYear) : null;

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
				if(data.valid === true) {
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
				if(data.valid === true) {
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

		let fileInput:any = document.getElementById('upload-background');
		let FileList:FileList = fileInput.files;
		let file:File = FileList[0];

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
	classChanged(id) {
		// Find class in class list
		let currentClass = null;
		for(let i = 0; i < this.classesList.length; i++) {
			if(id === this.classesList[i]._id) {
				currentClass = this.classesList[i];
				break;
			}
		}
		if(!currentClass) return true;

		// Find original class
		let ogClass = null;
		for(let i = 0; i < this.ogClasses.length; i++) {
			if(id === this.ogClasses[i]._id) {
				ogClass = this.ogClasses[i];
				break;
			}
		}
		if(!ogClass) return true;

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
		for(let i = 0; i < this.classesList.length; i++) {
			if(this.classChanged(this.classesList[i]._id)) {
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
		for(let i = 0; i < this.ogClasses.length; i++) {
			ogIds.push(this.ogClasses[i]._id);
		}

		for(let i = 0; i < this.classesList.length; i++) {
			let id = this.classesList[i]._id;

			// Check if there's an id that's in the table that isn't in the original
			if(!contains(ogIds, id)) {
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
		for(let i = 0; i < this.classesList.length; i++) {
			ids.push(this.classesList[i]._id);
		}

		for(let i = 0; i < this.ogClasses.length; i++) {
			let ogId = this.ogClasses[i]._id;

			// Check if there's an id that's in the original that isn't in the table
			if(!contains(ids, ogId)) {
				anyDeleted = true;
				break;
			}
		}
		return anyDeleted;
	}

	// Restore a class of a certain index
	restoreClass(id) {
		// Find original class
		let ogClass = null;
		for(let i = 0; i < this.ogClasses.length; i++) {
			if(id === this.ogClasses[i]._id) {
				ogClass = this.ogClasses[i];
				break;
			}
		}
		if(!ogClass) return;

		// Find class in class list
		for(let i = 0; i < this.classesList.length; i++) {
			if(id === this.classesList[i]._id) {
				this.classesList[i] = ogClass;
			}
		}
	}

	// Save any class that has been changed
	saveClasses() {
		// Delete any old classes
		let deleteObservables = [];
		for(let i = 0; i < this.deleteClassIds.length; i++) {
			console.log('add to dlete qeue', this.deleteClassIds[i])
			deleteObservables.push(this.classesService.deleteClass(this.deleteClassIds[i]));
		}

		// Reset delete class ids
		this.deleteClassIds = [];

		// Add any new classes
		let saveObservables = [];
		for(let i = 0; i < this.classesList.length; i++) {
			let id = this.classesList[i]._id;
			// If class changed, push
			if(this.classChanged(id)) {
				saveObservables.push(this.classesService.addClass(this.classesList[i]));
			}
		}

		// Combine all of those observables into a MEGA OBSERVABLE
		let deleteClasses$ = Observable.combineLatest(deleteObservables);
		let saveClasses$ = Observable.combineLatest(saveObservables);

		let deleteSubscription = deleteClasses$.subscribe(
			data => {
				this.alertService.addAlert('success', 'Success!', 'Deleted ' + data.length + ' classes.', 3);
			},
			error => {
				this.alertService.addAlert('danger', 'Delete Class Error!', error);
			}
		);

		let saveSubscription = saveClasses$.subscribe(
			ids => {
				this.alertService.addAlert('success', 'Success!', 'Saved ' + ids.length + ' classes.', 3);
				console.log(ids);
				// Go through all classes without ids and insert their new ids
				for(let i = 0; i < this.classesList.length; i++) {

					let currentClass = this.classesList[i];
					if(!currentClass._id) {
						console.log(i, 'doesnt have an id')
						// Add first id from new ids
						currentClass._id = ids[0];
						// Remove id from ids array
						ids.splice(0, 1);
					}
				}

				this.ogClasses = JSON.parse(JSON.stringify(this.classesList));
			},
			error => {
				this.alertService.addAlert('danger', 'Save Class Error!', error);
			}
		);
	}

	// Adds a class to the bottom
	addClass() {
		// Generate random color
		let color = '#000000'.replace(/0/g,function(){ return (~~(Math.random()*16)).toString(16); });
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

	deleteClass(i) {
		let id = this.classesList[i]._id;
		this.classesList.splice(i, 1);

		// If id is exists, push to array of deleted classes
		if(id) {
			this.deleteClassIds.push(id);
		}
	}

}
