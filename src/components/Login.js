import React, { Component } from 'react';
import { TextField, RaisedButton } from 'material-ui';
import { Grid, Row, Col } from 'react-flexbox-grid';

class Login extends Component {
  render() {
    return (
      <Grid fluid>
        <Row>
          <Col xs={12}>
            <Row center="xs">
              <Col xs={6} >
                <TextField
                  floatingLabelText="Password" />
              </Col>
            </Row>
          </Col>
          <Col xs={12}>
            <Row center="xs">
              <Col xs={6} >
                <TextField
                  floatingLabelText="Username" />
                </Col>
            </Row>
          </Col>
          <Col xs={12}>
            <Row center="xs">
              <Col xs={6} >
                <RaisedButton 
                label="Log in" 
                style={{margin: 12}} 
                onClick={() => {}}/>
              </Col>
            </Row>
          </Col>
        </Row>
      </Grid>
    );
  }
}

export default Login;
