
import {Pipe, PipeTransform} from '@angular/core';
import {DomSanitizationService} from '@angular/platform-browser';

/*
 * Bypasses Angular 2's sanitization to display things like URLs for iframes.
 * Only use this if you have already sanitized the input!
 */

@Pipe({name: 'safe'})
export class SafePipe {
	constructor(private sanitizer:DomSanitizationService) {}

	transform(style) {
		return this.sanitizer.bypassSecurityTrustResourceUrl(style);
	}
}
