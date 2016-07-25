// String is the string to capitalize, offset will ignore the first n characters (for stuff like '/' in a url)
export function capitalize(str:string, offset:number = 0) {
	return str.charAt(0 + offset).toUpperCase() + str.slice(1 + offset);
}
