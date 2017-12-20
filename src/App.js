import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import NavBar from './components/NavBar';
import Login from './components/Login';
import { BrowserRouter as Router, Route } from 'react-router-dom';

class App extends Component {
  render() {
    return (
      <MuiThemeProvider>
        <div>
          <NavBar></NavBar>
          <Router>
            <div>
              <Route exact path="/" render={() => <Login></Login>} />
              <Route path="/about" render={() => <Login></Login>} />
            </div>
          </Router>
        </div>
      </MuiThemeProvider>
    );
  }
}

export default App;
