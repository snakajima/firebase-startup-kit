import React from 'react';
import Header from './Header';
import { Route, BrowserRouter as Router } from 'react-router-dom';
import CssBaseline from '@material-ui/core/CssBaseline';
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import theme from './theme';
import Home from './Home';
import About from './About';

function App() {
  const params = {};
  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Route exact path="/" render={(props) => <Home {...props} params={params} />} />
        <Route exact path="/about" render={(props) => <About {...props} params={params} />} />
      </Router>
    </MuiThemeProvider>
  );
}

export default App;
