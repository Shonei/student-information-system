import React, { Component } from 'react';
import { TextField, RaisedButton } from 'material-ui';
import { Grid, Row, Col } from 'react-flexbox-grid';
import { createHmac } from 'crypto';

class Login extends Component {
  constructor(props) {
    super(props);
// throw new Error('sdfsgf');
    this.state = {
      error: ''
    };

    this.username = '';
    this.password = '';

    this.handleLogIn = this.handleLogIn.bind(this);
    this.fetchHTTPErrorCheck = this.fetchHTTPErrorCheck.bind(this);
    this.hashPassword = this.hashPassword.bind(this);
  }

  // A generic http responce parcer for the fetch api.
  fetchHTTPErrorCheck(res) {
    if (!res.ok) {
      return Promise.reject(res);
    } else {
      // returns a promise
      return res.json();
    }
  }

  // given the salt it hashes a users password and returns
  // a request that fetches the authentication token from the server.
  hashPassword(data) {
    let hash = createHmac('sha512', data.salt);
    hash.update(this.password);
    const pass = hash.digest('hex');

    return fetch('/get/token/' + this.username, {
      credentials: 'same-origin',
      headers: {
        'Authorization': pass
      }
    });
  }

  // called on button press
  handleLogIn() {
    fetch('/get/salt/' + this.username)
      .then(this.fetchHTTPErrorCheck)
      .then(this.hashPassword)
      .then(this.fetchHTTPErrorCheck)
      .then(data => {
        // set the token in the cookie with a 2 hours time to live
        var h = new Date();
        h.setTime(h.getTime() + (2 * 60 * 60 * 1000));
        document.cookie = 'token=' + data.token + ";" + "expires=" + h.toUTCString() + ";path=/";

        // Set user and access_level in the local storage so we can use it 
        // as a global shared state to manage the view.
        // This makes it so users have to always login once they leave the app.
        window.sessionStorage.setItem('access_level', data.level);

        // a somewhat ugly change of path but it works.
        let loc = '/';
        if (data.level === '1') {
          loc = '/student';
          window.sessionStorage.setItem('student', this.username);
        } else if (parseInt(data.level, 10) > 1) {
          loc = '/staff';
          window.sessionStorage.setItem('staff', this.username);
        }

        window.sessionStorage.setItem('loggedin', this.username);
        document.location.href = loc;
      })
      .catch(err => {
        let message = 'We encountered an error while trying to connect ot the server. Please reload and try again.';

        if (err.status == 500) {
          let message = 'We are currently expiriencing technical difficulties.';
        } else if (err.status == 401) {
          let message = 'Wrong username or password.';
        }

        // display error message to user
        this.setState({ error: message });
      });
  }

  render() {
    // throw new Error('fail');
    // return;
    return (
      <Grid fluid>
        <Row>
          <Col xs={12}>
            <Row center="xs">
              <Col xs={6} >
                <TextField
                  floatingLabelText="Username"
                  type="text"
                  onChange={(e, val) => { this.username = val; }} />
              </Col>
            </Row>
          </Col>
          <Col xs={12}>
            <Row center="xs">
              <Col xs={6} >
                <TextField
                  floatingLabelText="Password"
                  type="password"
                  onChange={(e, val) => { this.password = val; }} />
              </Col>
            </Row>
          </Col>
          <Col xs={12}>
            <Row center="xs">
              <Col xs={6} >
                <RaisedButton
                  label="Log in"
                  style={{ margin: 12 }}
                  onClick={this.handleLogIn} />
              </Col>
            </Row>
          </Col>
          <Col xs={12}>
            <Row center="xs">
              <Col xs={6} >
                <h3>Login Info</h3>
                <p><b>Student: </b>student/password</p>
                <p><b>Staff: </b>staff/password</p>
                <p><b>Admin: </b>admin/password</p>
              </Col>
            </Row>
          </Col>
        </Row>
        <Row center="xs">
          <p>{this.state.error}</p>
        </Row>
      </Grid>
    );
  }
}

export default Login;
