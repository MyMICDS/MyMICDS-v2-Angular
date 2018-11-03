import { Injectable } from '@angular/core';
import '../common/rxjs-operators';

declare const Trianglify: any;

@Injectable()
export class BackgroundService {

	constructor() { }

	generateTrianglify() {
		let bgURI = Trianglify({
			width: 1920,
			height: 1080,
			cell_size: Math.random() * 275 + 15,
			variance: Math.random()
		}).png();

		function dataURItoBlob(dataURI) {
			// convert base64 data component to raw binary data held in a string
			let byteString;
			if (dataURI.split(',')[0].indexOf('base64') >= 0) {
				byteString = atob(dataURI.split(',')[1]);
			}

			// separate out the mime component
			const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

			// write the bytes of the string to a typed array
			let ia = new Uint8Array(byteString.length);
			for (let i = 0; i < byteString.length; i++) {
				ia[i] = byteString.charCodeAt(i);
			}

			return new Blob([ia], { type: mimeString });
		}

		let bgBlob = dataURItoBlob(bgURI);
		return new File([bgBlob], 'trianglify', { type: 'image/png' });
	}

}
