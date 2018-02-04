import React, { Component } from 'react';
import { AppBar, FlatButton } from 'material-ui';
import Student from './Student';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Login from './Login';

const styles = {
  cursor: 'pointer',
};

class NavBar extends Component {
  constructor(props) {
    super(props);

    this.handleLogin = this.handleLogin.bind(this);
    this.handleHomeClick = this.handleHomeClick.bind(this);
  }

  handleLogin(user) {
    document.cookie = '';
    localStorage.clear();
    document.location.href = '/';
  }

  handleHomeClick() {
    let lvl = localStorage.getItem('access_level');
    let loc = '/';
    if (lvl === '1') {
      loc = '/student';
    } else if (parseInt(lvl, 10) > 1) {
      loc = '/staff';
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
            onClick={this.handleLogin} />}>
        </AppBar>
        <Router>
          <div>
            <Route exact path="/" render={() => <Login></Login>} />
            <Route path="/student" render={() => <Student></Student>} />
          </div>
        </Router>
      </div>
    );
  }
}

export default NavBar;
