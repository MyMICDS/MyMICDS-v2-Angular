
import {Pipe, PipeTransform} from '@angular/core';
import {DomSanitizationService} from '@angular/platform-browser';

/*
 * Bypasses Angular 2's sanitization to display things like URLs for iframes.
 * WARNING: Only use this if you have already sanitized the input!
 * DO NOT USE THIS IF YOU DON'T KNOW WHAT YOU ARE DOING.
 */

@Pipe({name: 'safeHtml'})
export class SafeHtmlPipe {
	constructor(private sanitizer:DomSanitizationService) {}

	transform(style) {
		return this.sanitizer.bypassSecurityTrustHtml(style);
	}
}

@Pipe({name: 'safeScript'})
export class SafeScriptPipe {
	constructor(private sanitizer:DomSanitizationService) {}

	transform(style) {
		return this.sanitizer.bypassSecurityTrustScript(style);
	}
}

@Pipe({name: 'safeStyle'})
export class SafeStylePipe {
	constructor(private sanitizer:DomSanitizationService) {}

	transform(style) {
		return this.sanitizer.bypassSecurityTrustStyle(style);
	}
}

@Pipe({name: 'safeUrl'})
export class SafeUrlPipe {
	constructor(private sanitizer:DomSanitizationService) {}

	transform(style) {
		return this.sanitizer.bypassSecurityTrustUrl(style);
	}
}

@Pipe({name: 'safeResourceUrl'})
export class SafeResourceUrlPipe {
	constructor(private sanitizer:DomSanitizationService) {}

	transform(style) {
		return this.sanitizer.bypassSecurityTrustResourceUrl(style);
	}
}
