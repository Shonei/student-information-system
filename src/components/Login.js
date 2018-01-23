import React, { Component } from 'react';
import { TextField, RaisedButton } from 'material-ui';
import { Grid, Row, Col } from 'react-flexbox-grid';
import { createHmac } from 'crypto';

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

  hashPassword(data) {
    let hash = createHmac('sha512', data.salt);
    hash.update(this.password);
    const pass = hash.digest('hex');

    return fetch('get/token/' + this.username, {
      method: 'POST',
      credentials: 'same-origin',
      headers: {
        'Authorization': pass
      }
    });
  }

  handleLogIn() {
    fetch('get/salt/' + this.username)
      .then(this.fetchHTTPErrorCheck)
      .then(this.hashPassword)
      .then(this.fetchHTTPErrorCheck)
      .then(data => {
        var h = new Date();
        h.setTime(h.getTime() + (2 * 60 * 60 * 1000));
        document.cookie = 'token=' + data.token + ";" + "expires=" + h.toUTCString() + ";path=/";
        window.localStorage.setItem('access_level', data.level);
        let loc = '/';
        if(data.level ===  '1') {
          loc = '/student';
        } else if (parseInt(data.level, 10) > 1 ) {
          loc = '/staff';
        }
        document.location.href = loc;

      })
      .catch(err => {
        err.text()
          .then(e => console.log(e))
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
        </Row>
      </Grid>
    );
  }
}

export default Login;
