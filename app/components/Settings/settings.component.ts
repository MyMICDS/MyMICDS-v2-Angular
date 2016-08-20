import * as config from '../../common/config'

import {Component} from '@angular/core';
import {NgFor, NgIf, NgForm, NgStyle} from '@angular/common';
import {ROUTER_DIRECTIVES} from '@angular/router';
import {REACTIVE_FORM_DIRECTIVES, FormBuilder, Validators} from '@angular/forms';
import {Observable} from 'rxjs/Observable';
import '../../common/rxjs-operators'
import {confirmPassword, confirmGrade} from '../../common/form-validation';
import {contains} from '../../common/utils';

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
	directives: [ROUTER_DIRECTIVES, REACTIVE_FORM_DIRECTIVES, NgFor, NgIf, NgStyle, BlurDirective, ColorPickerDirective],
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

	// Changed by the forms
	userInfo:any = null;
	// Array of graduation years
	gradeRange:number[];

	// Change info form
	infoForm:any = null;
	passwordForm:any = this.formBuilder.group({
		oldPassword: ['', Validators.required],
		newPassword: ['', Validators.required],
		confirmPassword: ['', Validators.required]
	}, { validator: confirmPassword('newPassword', 'confirmPassword') });

	userSubscription:any;

	// Portal URL Form
	portalSubscription:any;
	portalURL:string;
	portalValid:boolean;
	portalResponse:string;

	// Canvas URL Form
	canvasSubscription:any;
	canvasURL:string;
	canvasValid:boolean;
	canvasResponse:string;

	// Background Upload Form
	hasDefaultBackground = true;
	fileSelected = false;
	uploadingBackground = false;

	// Classes form
	classesSubscription:any;
	classesList:Array<Class>; //class list has all the classes after the user saves the classes they are edting, so it should be the same as the classes list in the server
	classesModel:Array<Class> = []; //classes model is the classes the user is editing, it is not saved to the server
	classesListOnPageLoad:Array<Class>; //classes list on page load is the classes list gotten from the server on page load. It provides restoring capabilities
	updatingClasses:boolean = false;
	deleteClassesArray:Array<number> = [];
	classesTypes = [
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
	classesBlocks = [
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
	teacherPrefixes = [
		'Mr.',
		'Ms.'
	];

	// Alias form
	aliasCollapsed:boolean = true;
	aliasesList:any;
	canvasClasses:any;
	portalClasses:any;
	selectedAliasClass:Class;

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
		this.userService.gradeRange().subscribe(
			gradeRange => {
				this.gradeRange = gradeRange;
			},
			error => {
				this.alertService.addAlert('danger', 'Settings Error!', error);
			}
		);

		//get list of user classes from service
		this.classesSubscription = this.classesService.getClasses().subscribe(
			classesList => {
				this.classesList = classesList;
				this.classesListOnPageLoad = JSON.parse(JSON.stringify(classesList));
				//prefill the form class model with the classes information
				this.classesModel = JSON.parse(JSON.stringify(this.classesList));
				for (let i=0;i<this.classesModel.length;i++) {
					//convert the colors to lower letters, because in the case of hex colors, uppercase letters will break the color picker in development mode of angular.
					this.classesModel[i].color = this.classesModel[i].color.toLowerCase()
				}
			},
			error => {
				this.alertService.addAlert('danger', 'Classes Error!', error);
			}
		);

		//get list of aliases
		Observable.concat(this.canvasService.getClasses(), this.portalService.getClasses()).subscribe(
			canvasThenPortalClasses => {
				!this.canvasClasses ? this.canvasClasses = canvasThenPortalClasses : this.portalClasses = canvasThenPortalClasses;
				console.log(canvasThenPortalClasses);
			},
			error => {
				this.alertService.addAlert('danger', 'Getting canvas/portal classes Error: ', error);
			},
			() => {
				this.aliasService.listAliases().subscribe(
					aliasesList => {
						this.aliasesList = aliasesList;
						console.log(this.aliasesList);
					},
					error => {
						this.alertService.addAlert('danger', 'Error getting the class alias list: ', error);
					}
				)
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
			this.portalSubscription = Observable.fromEvent(portalInput, 'keyup')
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

			this.canvasSubscription = Observable.fromEvent(canvasInput, 'keyup')
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
		this.portalSubscription.unsubscribe();
		this.canvasSubscription.unsubscribe();
		this.userSubscription.unsubscribe();
		this.classesSubscription.unsubscribe();
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

		// If classes value had changed
		let classesChanged:boolean;
		this.anyClassValueChanged((modelClass)=>{
			classesChanged = true;
		})

		return gradeChanged
			|| (this.userInfo.firstName !== this.infoForm.controls.firstName.value)
			|| (this.userInfo.lastName !== this.infoForm.controls.lastName.value)
			|| classesChanged;
		}

		canDeactivate():Observable<boolean> | boolean {
			if (!this.valueChanged()) return true;

			let p = new Promise<boolean>((res: (boolean)=>void, rej: ()=>void) => {
				window.confirm('Looks like you have some unsaved settings. Are you sure you wanna leave?') ?
				res(true) : res(false);
			});

			return Observable.fromPromise(p);
		}

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

	// classes form methods
	//add an empty class at the botton of the list
	addEmptyClass() {
		let emptyClassModel = {
			_id: undefined,
			name: '',
			color: '#fff',
			block: '',
			type: '',
			teacher: {
				prefix: '',
				firstName: '',
				lastName: ''
			}
		};
		this.classesModel.push(emptyClassModel);
	}

	// Use the classes model to update the classes
	updateClasses() {
		this.updatingClasses = true;
		let successCounter = 0;
		let addClasses = Observable.empty();
		let indexArr = [];
		let idArr = [];
		this.anyClassValueChanged((modelClass, i)=>{
			let o = this.classesService.addClass(modelClass);
			addClasses = Observable.merge(addClasses, o);
			indexArr.push(i);
		});
		addClasses.subscribe(
			(id:string) => {
				successCounter++;
				idArr.push(id);
			},
			error => {
				this.alertService.addAlert('danger', 'Error in class ' + this.classesModel[successCounter].name + ':', error);
			},
			() => {
				this.classesList = JSON.parse(JSON.stringify(this.classesModel));
				if (successCounter !== 0) {this.alertService.addAlert('success', '', 'Successfully updated ' + successCounter + ' class(es).')};
				this.updatingClasses = false;
				for (let i=0;i<indexArr.length;i++) {
					this.classesModel[indexArr[i]]._id = idArr[i];
				}
			}
		);
	}

	// Function to reverse a hex color
	reverseColor(color:string) {
		let red = parseInt(color.slice(1,3), 16);
		let green = parseInt(color.slice(3,5), 16);
		let blue = parseInt(color.slice(5,7), 16);
		let result = '#000'; let r,g,b;
		red > 0x88 ? r = red - 0x22 : r = red + 0x22;
		green > 0x88 ? g = green - 0x22 : g = green + 0x22;
		blue > 0x88 ? b = blue - 0x22 : b = blue + 0x22;
		result = '#' + r.toString(16).concat(g.toString(16).concat(b.toString(16)));
		return result;
	}

	// Function to generate css styles for the input
	applyColors(color:string) {
		return {
			'background-color': color,
			color: this.reverseColor(color),
			'font-size': '2em',
			padding: 0
		}
	}

	deleteClass(index:number) {
		let id = this.classesModel[index]._id;
		if (id) {
			this.updatingClasses = true;
			let p = new Promise<boolean>((res: (boolean)=>void, rej: ()=>void) => {
				window.confirm('Class "' + this.classesModel[index].name + '"will be deleted. Confirm?') ?
				res(true) : rej();
			});
			p.then(()=>{
				this.classesService.deleteClass(id).subscribe(
					res => {
						this.alertService.addAlert('success', 'Successfully deleted class', '');
						this.classesModel.splice(index, 1);
					},
					error => {
						this.alertService.addAlert('danger', 'Error deleting class: ', error);
						this.updatingClasses = false;
					},
					() => {
						this.classesList = JSON.parse(JSON.stringify(this.classesModel));
						this.updatingClasses = false
					}
				)
			}).catch(()=>{
				this.updatingClasses = false;
			});
		} else {
			this.classesModel.splice(index, 1);
		}
	}

	// Delete an array of classes
	deleteArrayClasses() {
		let arr = this.deleteClassesArray;
		for (let i=0;i<arr.length;i++) {
			this.deleteClass(arr[i]);
		}
	}

	restoreClasses() {
		if (this.classesListOnPageLoad.length < this.classesList.length) {
			for(let j=this.classesListOnPageLoad.length;j<this.classesList.length;j++) {
				this.deleteClassesArray.push(j);
			}
			this.deleteArrayClasses()
		}
		this.classesModel = JSON.parse(JSON.stringify(this.classesListOnPageLoad));
		for (let i=0;i<this.classesModel.length;i++) {
			// Convert the colors to lower letters, because in the case of hex colors, uppercase letters will break the color picker in development mode of angular.
			this.classesModel[i].color = this.classesModel[i].color.toLowerCase()
		}
	}

	// Detect changes in the class form, call back to be executed when change is detected
	classValueChanged(modelClass:Class, originalClass:Class) {
		return modelClass._id !== originalClass._id ||
			modelClass.type !== originalClass.type ||
			modelClass.color !== originalClass.color.toLowerCase() ||
			modelClass.teacher.prefix !== originalClass.teacher.prefix ||
			modelClass.teacher.firstName !== originalClass.teacher.firstName ||
			modelClass.teacher.lastName !== originalClass.teacher.lastName ||
			modelClass.block !== originalClass.block
	}

	anyClassValueChanged(callback:(modelClass, i)=>any) {
		for(let i=0;i<this.classesModel.length;i++) {
			let modelClass = this.classesModel[i];
			let originalClass = this.classesList[i] ? this.classesList[i] : {
				_id: undefined,
				name: '',
				color: '#fff',
				block: '',
				type: '',
				teacher: {
					prefix: '',
					firstName: '',
					lastName: ''
				}
			};
			if (this.classValueChanged(modelClass, originalClass)) {
				callback(modelClass, i);
			}
		}
	}

	// Alias methods
	previousIndex:number;
	aliasClass(index:number) {
		if (this.previousIndex === index) {
			this.aliasCollapsed = !this.aliasCollapsed;
		} else {
			this.aliasCollapsed = false;
			this.previousIndex = index;
		}
		this.selectedAliasClass = this.classesList[index];
	}

	aliasRegistered(type, name) {
		let aliasArr = this.aliasesList ? this.aliasesList[type] : [];
		for (let i=0;i<aliasArr.length;i++) {
			if (aliasArr[i].classRemote === name) {
				return true;
			}
		}
		return false;
	}

	notOwnAlias(type, classId, aliasClass) {
		let aliasArr = this.aliasesList ? this.aliasesList[type] : [];
		for (let i=0;i<aliasArr.length;i++) {
			if (aliasArr[i].classRemote === aliasClass && aliasArr[i].classNative !== classId) {
				return true
			}
			if (aliasArr[i].classRemote === aliasClass && aliasArr[i].classNative === classId) {
				return false
			}
		}
		return false;
	}

	// Add input debounce
	changeAlias(event, type, classString, classId) {
		if (event.target.checked) {
			this.aliasService.addAlias(type, classString, classId).subscribe(
				id => {
					console.log('added');
				},
				error => {
					this.alertService.addAlert('danger', 'Error adding alias', error)
				}
			)
		} else if (!event.target.checked) {
			let aliasArr = this.aliasesList ? this.aliasesList[type] : [];
			let aliasId;
			for (let i=0;i<aliasArr.length;i++) {
				if (aliasArr[i].classNative === classId) {
					aliasId = aliasArr[i]._id;
				}
			}
			this.aliasService.deleteAlias(aliasId).subscribe(
				res => {
					console.log('deleted');
				},
				error => {
					this.alertService.addAlert('danger', 'Error deleting alias', error)
				}
			)
		}
	}
}
