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

/*
 * Returns whether a value is in an array
 */

export function contains(haystack, needle) {
	if(!Array.isArray(haystack)) return false;
	return haystack.indexOf(needle) > -1
}

export function isEqual(a:Object, b:Object) {
	if (typeof a !== 'Object') {return};
	if (typeof b !== 'Object') {return};
	// Create arrays of property names
    var aProps = Object.getOwnPropertyNames(a);
    var bProps = Object.getOwnPropertyNames(b);

    // If number of properties is different,
    // objects are not equivalent
    if (aProps.length != bProps.length) {
        return false;
    }

    for (var i = 0; i < aProps.length; i++) {
        var propName = aProps[i];

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