import { AliasType, ListAliasesResponse, MyMICDS, MyMICDSClass } from '@mymicds/sdk';

import { Component, Input, OnInit } from '@angular/core';
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
	AliasType = AliasType;

	@Input() type: AliasType;

	@Input() externalClasses: string[];
	@Input() class: MyMICDSClass;

	aliases: ListAliasesResponse['aliases'];

	constructor(private mymicds: MyMICDS, private alertService: AlertService) {
		super();
	}

	ngOnInit() {
		// Get Aliases
		this.addSubscription(
			this.mymicds.alias.list().subscribe(({ aliases }) => {
				this.aliases = aliases;
			})
		);
	}

	// Returns the MyMICDS class object of the remote class name
	aliasClassObject(className: string) {
		if (this.aliases) {
			for (let alias of this.aliases[this.type]) {
				if (className === alias.classRemote) {
					return alias;
				}
			}

		}

		return null;
	}

	// Whether alias checkbox should be checked
	aliasChecked(className: string) {
		// Look if class name is in alias
		const aliasClassObject = this.aliasClassObject(className);
		// If class name is not in alias, default to enabled
		if (!aliasClassObject) { return false; }
		// If class name is in alias, check whether the it is for this class or another
		return this.class._id === aliasClassObject.classNative;
	}

	// Whether alias checkbox should be disabled
	aliasDisabled(className: string) {
		// Look if class name is in alias
		const aliasClassObject = this.aliasClassObject(className);
		// If class name is not in alias, default to enabled
		if (!aliasClassObject) { return false; }
		// If class name is in alias, check whether the it is for this class or another
		return this.class._id !== aliasClassObject.classNative;
	}

	// When the user either checks or unchecks the box
	aliasChange(event: Event, className: string) {
		if ((event.target as HTMLInputElement).checked) {
			// Add alias
			this.addSubscription(
				this.mymicds.alias.add({
					type: this.type,
					classString: className,
					classId: this.class._id
				}).subscribe(({ id }) => {
					this.alertService.addSuccess(`Linked ${this.type} class from this MyMICDS class!`);

					// Add alias to aliases array
					this.aliases[this.type].push({
						_id: id,
						// User is not necessary
						user: '',
						type: this.type,
						classNative: this.class._id,
						classRemote: className
					});
				})
			);
		} else {
			// Delete alias
			const aliasObject = this.aliasClassObject(className)!;
			const aliasId = aliasObject._id;
			this.addSubscription(
				this.mymicds.alias.delete({
					type: this.type,
					id: aliasId
				}).subscribe(() => {
					this.alertService.addSuccess(`Unlinked ${this.type} class from this MyMICDS class!`);

					// Remove alias from aliases array
					for (let i = 0; i < this.aliases[this.type].length; i++) {
						if (this.aliases[this.type][i]._id === aliasId) {
							this.aliases[this.type].splice(i, 1);
						}
					}
				})
			);
		}
	}

}
