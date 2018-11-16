import { MyMICDS } from '@mymicds/sdk';

import { Component, OnInit, NgZone } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { typeOf } from '../../common/utils';

import { SubscriptionsComponent } from '../../common/subscriptions-component';

@Component({
	selector: 'mymicds-suggestions',
	templateUrl: './suggestions.component.html',
	styleUrls: ['./suggestions.component.scss']
})
export class SuggestionsComponent extends SubscriptionsComponent implements OnInit {

	// We need to include this to use in HTML
	typeOf = typeOf;

	submitted = false;
	suggestionResponse: any = null;
	user: string;

	suggestionsForm: FormGroup;

	constructor(private mymicds: MyMICDS, private fb: FormBuilder, private ngZone: NgZone) {
		super();
	}

	ngOnInit() {
		this.suggestionsForm = this.fb.group({
			type: ['suggestion', Validators.required],
			submission: ['', Validators.required]
		});
	}

	submitSuggestions() {
		this.submitted = true;
		this.addSubscription(
			this.mymicds.suggestion.submit(this.suggestionsForm.value).subscribe(
				() => {
					this.ngZone.run(() => {
						this.suggestionResponse = true;
					});
				},
				err => {
					this.ngZone.run(() => {
						this.suggestionResponse = err;
					});
				}
			)
		);
	}

	resubmitForm() {
		this.submitted = false;
		this.suggestionResponse = null;
	}

}
