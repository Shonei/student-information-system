import React, { PureComponent } from 'react';
import { Grid, Row, Col } from 'react-flexbox-grid';
import StudentRow from './StudentRow';
import { Divider, RaisedButton } from 'material-ui';

class StudentList extends PureComponent {
  constructor() {
    super();

    this.state = {
      studentList: [],
      editing: false,
      cwkId: undefined
    };

    this.edited = {};

    this.getStudentList = this.getStudentList.bind(this);
    this.handleHandedInChange = this.handleHandedInChange.bind(this);
    this.handleResultChange = this.handleResultChange.bind(this);
    this.doPost = this.doPost.bind(this);
    this.updateStudentResults = this.updateStudentResults.bind(this);
  }

  componentDidMount() {
    let courseworkId = window.sessionStorage.getItem('coursework');
    this.setState({ cwkId: parseInt(courseworkId, 10) });

    fetch('/get/cwk/students/' + courseworkId, {
      method: 'GET',
      credentials: 'same-origin',
    }).then(e => e.json())
      .then(e => this.setState({ studentList: e }))
      .catch(console.error)
  }

  getStudentList(students, edit) {
    console.log(edit)
    return students.map((student, index) => {
      return <StudentRow
        key={index}
        student={student}
        edit={edit}
        cwkID={parseInt(this.state.cwkId, 10)}
        onResultChange={this.handleResultChange}
        onDateChange={this.handleHandedInChange} />;
    });
  }


  handleResultChange(studentId, result) {
    if (!this.edited[studentId]) {
      this.edited[studentId] = { result: parseInt(result, 10) };
      return;
    }

    this.edited[studentId].result = parseInt(result, 10);
  }

  handleHandedInChange(studentId, date) {
    if (!this.edited[studentId]) {
      this.edited[studentId] = { handed_in: date };
      return;
    }

    this.edited[studentId].handed_in = date;
  }

  doPost(data) {
    fetch('/update/cwk/results', {
      credentials: 'same-origin',
      method: "POST",
      body: JSON.stringify(data)
    }).then(res => {
      if (!res.ok) {
        return res.text();
      } else {
        // server doesn't send any data on a success
        // We switch from editing mode and give them the option to edit the results again
        this.setState({ edit: false });
      }
    }).catch(console.log)
  }

  updateStudentResults() {
    Object.keys(this.edited).forEach(key => {
      const data = {
        student_id: parseInt(key, 10),
        cwk_id: this.state.cwkId,
        result: this.edited[key].result,
        handed_in: this.edited[key].handed_in
      };
      console.log(data);
      // this.doPost(data);
    });

    this.setState({ editing: false });
  }

  render() {
    return (
      <Grid fluid>
        <Row>
          <Col xs={1} />
          <Col xs={10}>
            <h2>Students</h2>
            <Divider />
          </Col>
          <Col xs={1} />
        </Row>
        <Row start="xs">
          <Col xs={1} />
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
          <Col xs={1} />
        </Row>
        <Row start="xs">
          <Col xs={1} />
          <Col xs={10}>
            {this.getStudentList(this.state.studentList, this.state.editing)}
          </ Col>
          <Col xs={1} />
        </Row>
        <Row center="xs">
          <Col>
            <RaisedButton
              label={this.state.editing ? "Update" : "Edit"}
              primary={true}
              onClick={this.state.editing ? this.updateStudentResults : () => this.setState({ editing: true })}
            />
          </ Col>
        </Row>
      </Grid>
    );
  }
}

export default StudentList;
