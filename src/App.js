import React from 'react';
import Header from './Header';
import { Route, BrowserRouter as Router } from 'react-router-dom';
import CssBaseline from '@material-ui/core/CssBaseline';
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import theme from './theme';

function App() {
  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Header />
        <p>Hello World</p>
      </Router>
    </MuiThemeProvider>
  );
}

export default App;
