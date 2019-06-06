import './assets/global.css';
import 'fieldConfig';

import CssBaseline from '@material-ui/core/CssBaseline';
import createGenerateClassName from '@material-ui/core/styles/createGenerateClassName';
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import FormFieldsContext from '@react-form-fields/material-ui/components/Context';
import { theme } from 'assets/theme';
import Dialogs from 'components/Dialogs';
import AppRouter, { RouterContext } from 'components/Router';
import Alert from 'components/Shared/Alert';
import Snackbar from 'components/Shared/Snackbar';
import React from 'react';
import JssProvider from 'react-jss/lib/JssProvider';
import baseRoutes from 'routes';
import fieldConfig from 'fieldConfig';

const generateClassName = createGenerateClassName({
  dangerouslyUseGlobalCSS: true
});

class App extends React.PureComponent {
  router: AppRouter;

  getRouter = () => {
    return this.router;
  }

  render() {
    return (
      <JssProvider generateClassName={generateClassName}>
        <MuiThemeProvider theme={theme}>
          <FormFieldsContext config={fieldConfig}>
            <CssBaseline />
            <Dialogs />

            <Alert.Global />
            <Snackbar.Global />

            <RouterContext.Provider value={this.getRouter}>
              <AppRouter routes={baseRoutes} ref={ref => this.router = ref} />
            </RouterContext.Provider>
          </FormFieldsContext>
        </MuiThemeProvider>
      </JssProvider>
    );
  }
}

export default App;
