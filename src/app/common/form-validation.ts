/*
 * One SUPER function to return a combination of all of the confirm functions we have.
 * @TODO Find out a better way and remove this clustertruck
 */

import { UntypedFormGroup, ValidatorFn } from '@angular/forms';

export function confirmRegister(passwordParams: string[], gradeParams: string[]): ValidatorFn {
	return group => {
		const passwordResponse = confirmPassword(passwordParams[0], passwordParams[1])(group);
		const gradeResponse = confirmGrade(gradeParams[0], gradeParams[1])(group);

		// If both are null, return success
		if (!passwordResponse && !gradeResponse) {
			return null;
		}

		// At least one is an object with a key. If not null, append to response object.
		let response = {};
		if (passwordResponse) {
			response = Object.assign(response, passwordResponse);
		}
		if (gradeResponse) {
			response = Object.assign(response, gradeResponse);
		}
		return response;
	};
}

/*
 * Validates if input matches password
 */

export function confirmPassword(passwordKey: string, confirmPasswordKey: string): ValidatorFn {
	return group => {
		const password = (group as UntypedFormGroup).controls[passwordKey];
		const confirmation = (group as UntypedFormGroup).controls[confirmPasswordKey];

		if (password.value !== confirmation.value) {
			return { mismatchedPasswords: true };
		}

		return null;
	};
}

/*
 * Makes sure either teacher checkbox is selected or a graduation year is choosen
 */

export function confirmGrade(gradYearKey: string, teacherKey: string): ValidatorFn {
	return group => {
		const gradYear = (group as UntypedFormGroup).controls[gradYearKey];
		const teacher = (group as UntypedFormGroup).controls[teacherKey];

		if (!teacher.value && !gradYear.value) {
			return { invalidGrade: true };
		}

		return null;
	};
}
