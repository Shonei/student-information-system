import React, { Component } from 'react';
import { AppBar, FlatButton } from 'material-ui';
import Student from './student/Student';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Login from './Login';
import Staff from './staff/Staff';
import Search from './staff/Search';

const styles = {
  cursor: 'pointer',
};

class NavBar extends Component {
  constructor(props) {
    super(props);

    this.handleHomeClick = this.handleHomeClick.bind(this);
  }

  // Clears all global state and cookies
  handleLogoff(user) {
    document.cookie = '';
    localStorage.clear();
    document.location.href = '/';
  }

  // Based on the access level take the user to their home page
  handleHomeClick() {
    let lvl = localStorage.getItem('access_level');
    let loc = '/';
    let user = window.localStorage.getItem('loggedin');
    if (lvl === '1') {
      loc = '/student';
      window.localStorage.setItem('student', user);
    } else {
      loc = '/staff';
      window.localStorage.setItem('staff', user);
    } 
    document.location.href = loc;
  }

  render() {
    return (
      <div>
        <AppBar
          title={<span style={styles}>Home</span>}
          showMenuIconButton={false}
          onTitleClick={this.handleHomeClick}
          iconElementRight={<FlatButton label="Logoff"
            onClick={this.handleLogoff} />}>
        </AppBar>
        <Router>
          <div>
            <Route exact path="/" render={() => <Login></Login>} />
            <Route exact path="/student" render={() => <Student></Student>} />
            <Route exact path="/staff" render={() => <Staff></Staff>} />
            <Route exact path="/search" render={() => <Search></Search>} />
          </div>
        </Router>
      </div>
    );
  }
}

export default NavBar;
