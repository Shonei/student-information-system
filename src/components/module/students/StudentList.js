import React, { Component } from 'react';
import { Row, Col } from 'react-flexbox-grid';
import { Divider, TextField, RaisedButton } from 'material-ui';
import StudentRow from './StudentRow';
import {
  cyan900, cyan700
} from 'material-ui/styles/colors';

class StudentList extends Component {
  constructor(props) {
    super(props);

    this.underlineStyle = {
      borderColor: cyan900
    };

    this.state = {
      students: [],
      error: '',
      code: sessionStorage.getItem('module'),
      student: ''
    };

    this.handleAddStudent = this.handleAddStudent.bind(this);
  }

  componentDidMount() {
    fetch('/get/module/students/' + this.state.code)
      .then(res => {
        if (!res.ok) {
          this.setState({ error: 'We weren\'t able to retrieve the student listenerCount.' });
          return;
        }
        return res.json();
      })
      .then(data => this.setState({ students: data }))
      .catch(err => {
        this.setState({ error: 'Something wen\'t wrong. Reload the page and try agian' });
      });
  }

  handleAddStudent() {
    fetch('/add/module/student', {
      credentials: 'same-origin',
      method: "POST",
      body: JSON.stringify({
        student_id: parseInt(this.state.student, 10),
        module_code: this.state.code
      })
    }).then(res => {
      if (!res.ok) {
        this.setState({ error: 'We were unable to add the student.' });
        return;
      }

      window.location.reload();
    }).catch(err => {
      this.setState({ error: 'We were unable to add the student.' });
    });
  }

  render() {
    return (
      <Row start="xs">
        <Col xs={1} />
        <Col xs={10} >
          <h3>Students enrolled on module {this.state.code}</h3>
          <Divider />
          <Row>
            <Col xs>
              <p><b>ID</b></p>
            </ Col>
            <Col xs >
              <p><b>Name</b></p>
            </Col>
            <Col xs />
          </Row>
          {this.state.students.map((s, i) => <StudentRow
            key={s.id}
            onFail={err => this.setState({ error: 'We were unable top remove the student.' })}
            onSuccess={data => this.setState(prev => {
              // remove the student from slice
              prev.students.splice(i, 1);
              return prev;
            })}
            id={s.id}
            username={s.username}
            code={this.state.code}>
          </StudentRow>)}
          <Row>
            <Col xs >
              <Divider />
              <br />
              <Row start="xs">
                <Col xs >
                  <TextField
                    value={this.state.student}
                    hintText={'student ID'}
                    underlineStyle={this.underlineStyle}
                    onChange={(e, v) => {
                      if (v.match(/^$|[0-9]/) != null) {
                        this.setState({ student: v });
                      }
                    }}
                    rows={1}
                    type={"text"} />
                </ Col>
                <Col xs >
                  <RaisedButton
                    style={{ cursor: "pointer" }}
                    onClick={this.handleAddStudent}
                    primary={true}
                    label={"Add"} />
                </ Col>
              </Row>
            </ Col>
          </Row>
          <p>{this.state.error}</p>
        </ Col>
        <Col xs={1} />
      </Row >
    );
  }
}

export default StudentList;
