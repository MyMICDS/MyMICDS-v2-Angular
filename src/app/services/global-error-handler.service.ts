import { ErrorHandler, Injectable } from '@angular/core';
import * as Sentry from '@sentry/angular';



@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
    // sentryErrorHandler = Sentry.createErrorHandler({
    //     showDialog: true,
    // })

    handleError(error: Error) {
        const chunkFailedMessage = /Loading chunk [\d]+ failed/;
        if (chunkFailedMessage.test(error.message)) {

            window.location.reload();

        }

        // this.sentryErrorHandler.handleError(error); TODO FIX
    }
}
