import * as config from './common/config';
import {enableProdMode} from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import {AppModule} from './app.module';

if(config.recruitMessage) {
	console.log(`
                          ______   ____     ____    ____                        __
 /'\\_/\`\\          /'\\_/\`\\/\\__  _\\ /\\  _\`\\  /\\  _\`\\ /\\  _\`\\                     /\\ \\__
/\\      \\  __  __/\\      \\/_/\\ \\/ \\ \\ \\/\\_\\\\ \\ \\/\\ \\ \\,\\L\\_\\        ___      __\\ \\ ,_\\
\\ \\ \\__\\ \\/\\ \\/\\ \\ \\ \\__\\ \\ \\ \\ \\  \\ \\ \\/_/_\\ \\ \\ \\ \\/_\\__ \\      /' _ \`\\  /'__\`\\ \\ \\/
 \\ \\ \\_/\\ \\ \\ \\_\\ \\ \\ \\_/\\ \\ \\_\\ \\__\\ \\ \\L\\ \\\\ \\ \\_\\ \\/\\ \\L\\ \\  __/\\ \\/\\ \\/\\  __/\\ \\ \\_
  \\ \\_\\\\ \\_\\/\`____ \\ \\_\\\\ \\_\\/\\_____\\\\ \\____/ \\ \\____/\\ \`\\____\\/\\_\\ \\_\\ \\_\\ \\____\\\\ \\__\\
   \\/_/ \\/_/\`/___/> \\/_/ \\/_/\\/_____/ \\/___/   \\/___/  \\/_____/\\/_/\\/_/\\/_/\\/____/ \\/__/
               /\\___/
               \\/__/

I see you looking at the code ( ͡° ͜ʖ ͡°) Don't bother Angular 2 is unreadable after it is compiled.
But you know what you should do? Join the MyMICDS Development Team.
Fill out this form https://goo.gl/forms/wirh6A3Jnr or email support@mymicds.net. More information at the bottom of the About Page!

`);
}

// Enable production mode if we are in production mode
if(config.production) {
	enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule);