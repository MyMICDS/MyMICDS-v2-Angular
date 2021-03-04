import './polyfills.ts';

import { AppModule } from './app/app.module';
import { enableProdMode } from '@angular/core';
import { environment } from './environments/environment';
import { Integrations } from '@sentry/tracing';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { release } from './release';
import * as Sentry from '@sentry/angular';

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
	enabled: environment.production,
	release,
	// Known issues with SPAs, safe to ignore for now
	// https://twittercommunity.com/t/timeline-widget-not-destroyed-on-single-page-application-page-change-spa/84023/11
	denyUrls: [/twitter\.com/]
});

if (environment.production) {
	enableProdMode();
}

void platformBrowserDynamic().bootstrapModule(AppModule);

if (environment.recruitMessage) {
	/* eslint-disable @typescript-eslint/indent */
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
	/* eslint-enable @typescript-eslint/indent */
}
