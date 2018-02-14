import React, { Component } from 'react';
import { TextField, RaisedButton } from 'material-ui';
import { Grid, Row, Col } from 'react-flexbox-grid';
import { createHmac } from 'crypto';
// import fetch from 'node-fetch';

class Login extends Component {
  constructor(props) {
    super(props);

    this.username = '';
    this.password = '';

    this.handleLogIn = this.handleLogIn.bind(this);
    this.fetchHTTPErrorCheck = this.fetchHTTPErrorCheck.bind(this);
    this.hashPassword = this.hashPassword.bind(this);
  }

  // A generic http responce parcer for the fetch api.
  fetchHTTPErrorCheck(res) {
    if (!res.ok) {
      throw res;
    } else {
      return res.json();
    }
  }

  // given the salt it hashes a users password and returns
  // a request to generate the token.
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
        // set the token in hte cookie with a 2 hours time to live
        var h = new Date();
        h.setTime(h.getTime() + (2 * 60 * 60 * 1000));
        document.cookie = 'token=' + data.token + ";" + "expires=" + h.toUTCString() + ";path=/";

        // Set user and access_level in the local storage so we can use it 
        // as a global shared state to manage the view.
        // This makes it so users have to always login once they leave the app.
        window.localStorage.setItem('access_level', data.level);

        // a somewhat ugly change of path but it works.
        let loc = '/';
        if (data.level === '1') {
          loc = '/student';
          window.localStorage.setItem('student', this.username);
        } else if (parseInt(data.level, 10) > 1) {
          loc = '/staff';
          window.localStorage.setItem('staff', this.username);
        }
        window.localStorage.setItem('loggedin', this.username);
        document.location.href = loc;
      })
      .catch(err => {
        console.log(err)
        // err.text()
        //   .then(e => console.log(e))
      });
  }

  render() {
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
      </Grid>
    );
  }
}

export default Login;
