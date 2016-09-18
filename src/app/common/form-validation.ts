/*
 * One SUPER function to return a combination of all of the confirm functions we have.
 * @TODO Find out a better way and remove this clustertruck
 */

export function confirmRegister(passwordParams: string[], gradeParams: string[]) {
	return (group: any): {[key: string]: any} => {

		let passwordResponse = confirmPassword(passwordParams[0], passwordParams[1])(group);
		let gradeResponse = confirmGrade(gradeParams[0], gradeParams[1])(group);

		// If both are null, return success
		if (!passwordResponse && !gradeResponse)  { return null; }

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

export function confirmPassword(passwordKey: string, confirmPasswordKey: string) {
	return (group: any): {[key: string]: any} => {
		let password = group.controls[passwordKey];
		let confirmPassword = group.controls[confirmPasswordKey];

		if (password.value !== confirmPassword.value) {
			return { mismatchedPasswords: true };
		}
	};
}

/*
 * Makes sure either teacher checkbox is selected or a graduation year is choosen
 */

export function confirmGrade(gradYearKey: string, teacherKey: string) {
	return (group: any): {[key: string]: any} => {
		let gradYear = group.controls[gradYearKey];
		let teacher = group.controls[teacherKey];

		if (!teacher.value && !gradYear.value) {
			return { invalidGrade: true };
		}
	};
}
