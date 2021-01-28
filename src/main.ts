import './polyfills.ts';

import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { enableProdMode } from '@angular/core';
import { environment } from './environments/environment';
import { AppModule } from './app/app.module';
import * as Sentry from '@sentry/angular';
import { Integrations } from '@sentry/tracing';
import { release } from './release';

Sentry.init({
	dsn: 'https://5b482947b3f44153a674e6f676d9cdf8@o355493.ingest.sentry.io/5551465',
	autoSessionTracking: true,
	integrations: [
		new Integrations.BrowserTracing({
			tracingOrigins: ['localhost', 'https://mymicds.net'],
			routingInstrumentation: Sentry.routingInstrumentation,
		}),
	],
	tracesSampleRate: 1.0,
	release: release
});

if (environment.production) {
	enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule);

if (environment.recruitMessage) {
	/* tslint:disable:indent */
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

I see you looking at the code ( ͡° ͜ʖ ͡°) Don't bother Angular is unreadable after it is compiled.
But you know what you should do? Please join the MyMICDS Development Team. We really need people. Please join... Please.
Fill out this form https://goo.gl/forms/wirh6A3Jnr or email support@mymicds.net. More information at the About Page!

`);
	/* tslint:enable:indent */
}
