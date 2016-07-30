/*
 * One SUPER function to return a combination of all of the confirm functions we have.
 * @TODO Find out a better way and remove this clustertruck
 */

export function confirmRegister(passwordParams:string[], gradeParams:string[]) {
	return (group:any): {[key: string]: any} => {

		if(confirmPassword(passwordParams[0], passwordParams[1])(group)
			|| confirmGrade(gradeParams[0], gradeParams[1])(group)) {

			return {
				invalid: true
			};
		} else {
			console.log('everythign is valid')
		}
	}
}

/*
 * Validates if input matches password
 */

export function confirmPassword(passwordKey:string, confirmPasswordKey:string) {
	return (group:any): {[key: string]: any} => {
		let password = group.controls[passwordKey];
		let confirmPassword = group.controls[confirmPasswordKey];

		if(password.value !== confirmPassword.value) {
			return {
				mismatchedPasswords: true
			};
		}
	}
}

/*
 * Makes sure either teacher checkbox is selected or a graduation year is choosen
 */

export function confirmGrade(gradYearKey:string, teacherKey:string) {
	return (group:any): {[key: string]: any} => {
		let gradYear = group.controls[gradYearKey];
		let teacher = group.controls[teacherKey];

		// console.log('grad year', gradYear);
		// console.log('teacher', teacher);

		if(!teacher.value && !gradYear.value) {
			return {
				invalidGrade: true
			};
		}
	}
}
