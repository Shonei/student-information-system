import React, { Component } from 'react';
import { AppBar, FlatButton } from 'material-ui';
import Student from './student/Student';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Login from './Login';
import Staff from './staff/Staff';
import Search from './staff/Search';
import SearchBar from './staff/SearchBar';
import Module from './module/Module';
import Coursework from './coursework/Coursework';
import CreateModule from './create-module/CreateModule';
import StudentList from './module/students/StudentList';
import ErrorBoundary from './ErrorBoundary';
import Error404 from './404Error';

const styles = {
  cursor: 'pointer',
};

class NavBar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      accessLevel: 0
    };

    this.handleHomeClick = this.handleHomeClick.bind(this);
  }

  componentDidMount() {
    const lvl = sessionStorage.getItem('access_level');
    this.setState({ accessLevel: parseInt(lvl, 10) });
  }

  // Clears all global state and cookies
  handleLogoff(user) {
    document.cookie = '';
    sessionStorage.clear();
    document.location.href = '/';
  }

  // Based on the access level take the user to their home page
  handleHomeClick() {
    let loc = '/';
    let user = window.sessionStorage.getItem('loggedin');
    if (this.state.accessLevel === 1) {
      loc = '/student';
      window.sessionStorage.setItem('student', user);
    } else if (this.state.accessLevel > 1) {
      loc = '/staff';
      window.sessionStorage.setItem('staff', user);
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
        {this.state.accessLevel > 1 ? <SearchBar></SearchBar> : <div />}
        <ErrorBoundary>
          <Router>
            <Switch>
              <Route exact path="/" render={() => <Login></Login>} />
              <Route exact path="/student" render={() => <Student></Student>} />
              <Route exact path="/staff" render={() => <Staff></Staff>} />
              <Route exact path="/search" render={() => <Search></Search>} />
              <Route exact path="/module" render={() => <Module></Module>} />
              <Route exact path="/coursework" render={() => <Coursework></Coursework>} />
              <Route exact path="/create/module" render={() => <CreateModule></CreateModule>} />
              <Route exact path="/module/students" render={() => <StudentList></StudentList>} />
              <Route component={Error404} />
            </Switch>
          </Router>
        </ErrorBoundary>
      </div>
    );
  }
}

export default NavBar;
