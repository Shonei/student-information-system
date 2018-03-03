import React, { PureComponent } from 'react';
import { Grid, Row, Col } from 'react-flexbox-grid';
import StudentRow from './StudentRow';
import { Divider } from 'material-ui';

class StudentList extends PureComponent {
  constructor() {
    super();

    this.state = {
      studentList: []
    };

    this.getStudentList = this.getStudentList.bind(this);
  }

  componentDidMount() {
    let courseworkId = window.sessionStorage.getItem('coursework');

    fetch('/get/cwk/students/' + courseworkId, {
      method: 'GET',
      credentials: 'same-origin',
    }).then(e => e.json())
      .then(e => this.setState({ studentList: e }))
      .catch(console.error)
  }

  getStudentList(students) {
    return students.map((student, index) => {
      return <StudentRow key={index} student={student} cwkID={parseInt(this.state.id, 10)}/>;
    });
  }

  render() {
    return (
      <Grid fluid>
        <Row>
          <Col xs={2} />
          <Col xs={8}>
            <h2>Students</h2>
            <Divider />
          </Col>
          <Col xs={2} />
        </Row>
        <Row start="xs">
          <Col xs={2} />
          <Col xs>
            <h3>ID</h3>
          </ Col>
          <Col xs >
            <h3>Username</h3>
          </Col>
          <Col xs>
            <h3>Marks</h3>
          </ Col>
          <Col xs>
            <h3>Handed in</h3>
          </ Col>
          <Col xs>
          </ Col>
          <Col xs={2} />
        </Row>
        <Row start="xs">
          <Col xs={2} />
          <Col xs={8}>
            {this.getStudentList(this.state.studentList)}
          </ Col>
          <Col xs={2} />
        </Row>
      </Grid>
    );
  }
}

export default StudentList;
