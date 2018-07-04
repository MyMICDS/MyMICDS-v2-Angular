import { MyMICDS, MyMICDSClass, AliasType } from '@mymicds/sdk';

import { Component, OnInit, Input } from '@angular/core';
import { contains } from '../../../common/utils';

import { SubscriptionsComponent } from '../../../common/subscriptions-component';
import { AlertService } from '../../../services/alert.service';

@Component({
	selector: 'mymicds-aliases',
	templateUrl: './aliases.component.html',
	styleUrls: ['./aliases.component.scss']
})
export class AliasesComponent extends SubscriptionsComponent implements OnInit {

	// For template
	contains = contains;

	@Input() type: AliasType;

	@Input() externalClasses: string[];
	@Input() class: MyMICDSClass;

	aliases = {};

	constructor(private mymicds: MyMICDS, private alertService: AlertService) {
		super();
	}

	ngOnInit() {
		// Get Aliases
		this.addSubscription(
			this.mymicds.alias.list().subscribe(
				aliases => {
					this.aliases = aliases;
				},
				error => {
					this.alertService.addAlert('danger', 'Get Aliases Error!', error);
				}
			)
		);
	}

	// Returns native class id alias belongs to is in, or null if no class
	aliasClassObject(type: AliasType, className: string) {
		// Make sure it's a valid alias type
		if (!(type in AliasType)) { return; }

		for (let alias of this.aliases[type]) {
			if (className === alias.classRemote) {
				return alias;
			}
		}

		return null;
	}

	// Whether alias checkbox should be checked
	aliasChecked(className: string, classId: string) {
		// Look if class name is in alias
		const aliasClassObject = this.aliasClassObject(this.type, className);
		// If class name is not in alias, default to enabled
		if (!aliasClassObject) { return false; }
		// If class name is in alias, check whether the it is for this class or another
		return classId === aliasClassObject.classNative;
	}

	// Whether alias checkbox should be disabled
	aliasDisabled(className: string, classId: string) {
		// Look if class name is in alias
		let aliasClassObject = this.aliasClassObject(this.type, className);
		// If class name is not in alias, default to enabled
		if (!aliasClassObject) { return false; }
		// If class name is in alias, check whether the it is for this class or another
		return classId !== aliasClassObject.classNative;
	}

	// When the user either checks or unchecks the box
	aliasChange(event, className: string, classId: string) {
		// Make sure it's a valid alias type
		if (!(this.type in AliasType)) { return; }

		if (event.target.checked) {
			// Add alias
			this.addSubscription(
				this.mymicds.alias.add({
					type: this.type,
					classString: className,
					classId
				}).subscribe(
					id => {
						this.alertService.addAlert('success', 'Success!', 'Linked alias to class!', 3);

						// Add alias to aliases array
						this.aliases[this.type].push({
							_id: id,
							type: this.type,
							classNative: classId,
							classRemote: className
						});
					},
					error => {
						this.alertService.addAlert('danger', 'Add Alias Error!', error);
					}
				)
			);
		} else {
			// Delete alias
			let aliasObject = this.aliasClassObject(this.type, className);
			let aliasId = aliasObject._id;
			this.addSubscription(
				this.mymicds.alias.delete({
					type: this.type,
					id: aliasId
				}).subscribe(
					() => {
						this.alertService.addAlert('success', 'Success!', 'Deleted alias from class!', 3);

						// Remove alias from aliases array
						for (let i = 0; i < this.aliases[this.type].length; i++) {
							if (this.aliases[this.type][i]._id === aliasId) {
								this.aliases[this.type].splice(i, 1);
							}
						}
					},
					error => {
						this.alertService.addAlert('danger', 'Delete Alias Error!', error);
					}
				)
			);
		}
	}

}
