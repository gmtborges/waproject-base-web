import * as loaderOperator from 'helpers/rxjs-operators/loader';
import * as logErrorOperator from 'helpers/rxjs-operators/logError';

import loaderService from './loader';
import logService from './log';

export function setupServices(): void {
  loaderOperator.setup(loaderService);
  logErrorOperator.setup(logService);
}
