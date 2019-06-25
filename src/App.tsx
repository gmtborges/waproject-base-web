import './assets/global.css';
import 'fieldConfig';

import CssBaseline from '@material-ui/core/CssBaseline';
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import FormFieldsContext from '@react-form-fields/material-ui/components/Context';
import { theme } from 'assets/theme';
import Dialogs from 'components/Dialogs';
import AppRouter, { RouterContext } from 'components/Router';
import Alert from 'components/Shared/Alert';
import Snackbar from 'components/Shared/Snackbar';
import React from 'react';
import baseRoutes from 'routes';
import fieldConfig from 'fieldConfig';

class App extends React.PureComponent {
  router = React.createRef<AppRouter>();

  getRouter = () => {
    return this.router.current;
  }

  render() {
    return (
      <MuiThemeProvider theme={theme}>
        <FormFieldsContext config={fieldConfig}>
          <CssBaseline />
          <Dialogs />

          <Alert.Global />
          <Snackbar.Global />

          <RouterContext.Provider value={this.getRouter}>
            <AppRouter routes={baseRoutes} ref={this.router} />
          </RouterContext.Provider>
        </FormFieldsContext>
      </MuiThemeProvider>
    );
  }
}

export default App;
