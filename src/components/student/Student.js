import React, { Component } from 'react';
import { wrapFetch as fetch } from './../helpers';
import { Avatar } from 'material-ui';
import { Grid, Row, Col } from 'react-flexbox-grid';
import Tables from './Tables';

class Student extends Component {
  constructor() {
    super();

    this.state = {
      first_name: '',
      middle_name: '',
      last_name: '',
      email: '',
      entry_year: '',
      current_level: '',
      id: ''
    };
  }

  componentDidMount() {
    fetch('student', '/get/student/profile/')
      .then(j => this.setState(() => j))
      .catch(console.log)
  }

  render() {
    return (
      <Grid fluid>
        <br />
        <Row center="xs">
          <Col xs={12} md={3}>
            <Avatar src="https://github.com/Shonei/student-information-system/blob/master/database.jpg?raw=true"
              size={180} />
            <p><b>ID: </b>{this.state.id}</p>
          </Col>
          <Col xs={12} md={3}>
            <p><b>First name: </b>{this.state.first_name}</p>
            <p><b>Middle name: </b>{this.state.middle_name}</p>
            <p><b>Last name: </b>{this.state.last_name}</p>
            <p><b>Email: </b>{this.state.email}</p>
            <p><b>Entry year: </b>{new Date(this.state.entry_year).toLocaleString()}</p>
            <p><b>Current level: </b>{this.state.current_level}</p>
          </Col>
        </Row>
        <Tables></Tables>
      </Grid>
    );
  }
}

export default Student;
