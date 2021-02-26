import { ErrorHandler, Injectable } from '@angular/core';
import * as Sentry from '@sentry/angular';

const sentryErrorHandler = Sentry.createErrorHandler({
    showDialog: true,
})

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
    handleError(error: Error) {
        const chunkFailedMessage = /Loading chunk [\d]+ failed/;
        if (chunkFailedMessage.test(error.message)) {

            window.location.reload();

        }

        sentryErrorHandler.handleError(error);
    }
}
