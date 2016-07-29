/*
 * Capitalize every word of a string, offset will ignore the first n characters.
 */

export function capitalize(str:string, offset:number = 0) {
	// Slice string n characters
	let subStr = str.slice(offset);
	// Turn all dashes/hypthens (-) into spaces ( )
	let strSpaces = subStr.replace(/-/g, ' ');
	// Capitalize beginning of each word
	return strSpaces.replace(/\b\w/g, l => l.toUpperCase());
}

/*
 * Whether string contains anything other than alphabetic characters.
 */

export function isAlphabetic(str:string) {
	return /^[a-zA-Z()]+$/.test(str);
}

/*
 * Returns the type of something
 */

export function typeOf(something:any) {
	return typeof something;
}
