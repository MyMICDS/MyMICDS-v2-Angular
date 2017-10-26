import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { typeOf } from '../../common/utils';

import { AlertService } from '../../services/alert.service';
import { SuggestionsService } from '../../services/suggestions.service';

@Component({
	selector: 'mymicds-suggestions',
	templateUrl: './suggestions.component.html',
	styleUrls: ['./suggestions.component.scss']
})
export class SuggestionsComponent implements OnInit {

	// We need to include this to use in HTML
	typeOf = typeOf;

	submitted = false;
	suggestionResponse: any = null;
	user: string;

	suggestionsForm: FormGroup;

	constructor(private alertService: AlertService, private suggestionsService: SuggestionsService, private fb: FormBuilder) { }

	ngOnInit() {
		this.suggestionsForm = this.fb.group({
			type: ['suggestion', Validators.required],
			submission: ['', Validators.required]
		});
	}

	submitSuggestions() {
		this.submitted = true;
		this.suggestionsService.sendSuggestions(this.suggestionsForm.value).subscribe(
			val => {
				this.suggestionResponse = true;
			},
			err => {
				this.suggestionResponse = err;
			}
		);
	}

	resubmitForm() {
		this.submitted = false;
		this.suggestionResponse = null;
	}

}
