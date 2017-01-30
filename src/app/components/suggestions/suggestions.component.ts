import { Component, OnInit } from '@angular/core';
import { AlertService } from '../../services/alert.service';
import { SuggestionsService } from '../../services/suggestions.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
	selector: 'mymicds-suggestions',
	templateUrl: './suggestions.component.html',
	styleUrls: ['./suggestions.component.scss']
})
export class SuggestionsComponent implements OnInit {

	suggestionsForm: FormGroup;

	constructor(private alertService: AlertService, private suggestionsService: SuggestionsService, private fb: FormBuilder) { }

	ngOnInit() {
		this.suggestionsForm = this.fb.group({
			type: ['suggestion', Validators.required],
			submission: ['', Validators.required]
		});
	}

	submitSuggestions() {
		this.suggestionsService.sendSuggestions(this.suggestionsForm.value).subscribe(
			val => {
				this.alertService.addAlert('success', 'Success!', 'Suggestion submitted. MyMICDS devs will be working on it.');
			},
			err => {
				this.alertService.addAlert('danger', 'Submittion failed.', 'Check if you are logged in, or you can reach us via support@mymicds.net');
			}
		);
	}

}
