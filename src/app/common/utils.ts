/*
 * Capitalize every word of a string, offset will ignore the first n characters.
 */

export function capitalize(str: string, offset = 0) {
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

export function isAlphabetic(str: string) {
	return /^[a-zA-Z()]+$/.test(str);
}

/*
 * Returns the type of something
 */

export function typeOf(something: any) {
	return typeof something;
}

/*
 * Returns whether a value is in an array
 */

export function contains(haystack, needle) {
	if (!Array.isArray(haystack)) {
		return false;
	}
	return haystack.indexOf(needle) > -1;
}

/*
 * Determines if two objects are equal to each other
 */

export function isEqual(a: any, b: any) {
	if (typeof a !== 'object') { return null; }
	if (typeof b !== 'object') { return null; }
	// Create arrays of property names
	const aProps = Object.getOwnPropertyNames(a);
	const bProps = Object.getOwnPropertyNames(b);

	// If number of properties is different,
	// objects are not equivalent
	if (aProps.length !== bProps.length) {
		return false;
	}

	for (let i = 0; i < aProps.length; i++) {
		const propName = aProps[i];

		// If values of same property are not equal,
		// objects are not equivalent
		if (a[propName] !== b[propName]) {
			return false;
		}
	}

	// If we made it this far, objects
	// are considered equivalent
	return true;
}

/*
 * Takes a hex color (with out without #) and lightens it or darkens it according to a percentage.
 * Did I copy this off of https://css-tricks.com/snippets/javascript/lighten-darken-color/? Maybe.
 * Does it work? Yes.
 */

/* tslint:disable:no-bitwise */
export function darkenColor(color: string, amt: number) {

	if (typeof color !== 'string') {
		color = '#7F7F7F';
	}

	let usePound = false;

	if (color[0] === '#') {
		color = color.slice(1);
		usePound = true;
	}

	const num = parseInt(color, 16);

	let r = (num >> 16) + amt;

	if (r > 255) {
		r = 255;
	} else if (r < 0) {
		r = 0;
	}

	let b = ((num >> 8) & 0x00FF) + amt;

	if (b > 255) {
		b = 255;
	} else if (b < 0) {
		b = 0;
	}

	let g = (num & 0x0000FF) + amt;

	if (g > 255) {
		g = 255;
	} else if (g < 0) {
		g = 0;
	}

	return (usePound ? '#' : '') + String('000000' + (g | (b << 8) | (r << 16)).toString(16)).slice(-6);

}
/* tslint:enable:no-bitwise */

/*
 * Converts a hex color to an array of RGB values
 */

export function hexToRgb(hex: string) {
	// Expand shorthand form (e.g. '03F') to full form (e.g. '0033FF')
	const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
	hex = hex.replace(shorthandRegex, function(m, r, g, b) {
		return r + r + g + g + b + b;
	});

	const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	return result ? [
		parseInt(result[1], 16),
		parseInt(result[2], 16),
		parseInt(result[3], 16)
	] : null;
}
