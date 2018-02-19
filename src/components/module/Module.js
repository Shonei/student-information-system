import React, { PureComponent } from 'react';
import { Grid, Row, Col } from 'react-flexbox-grid';
import { Paper, Divider, RaisedButton, TextField } from 'material-ui';
import CwkList from './CwkList';

class Module extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      exam: [],
      cwks: [],
      editing: false,
    };

    this.updateExams = {};
    this.updateCwks = {};

    this.updateCwkList = this.updateCwkList.bind(this);
    this.getExam = this.getExam.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.postdata = this.postDate.bind(this);
  }

  componentDidMount() {
    let moduleId = window.sessionStorage.getItem('module');

    fetch('/get/module/' + moduleId, {
      method: 'GET',
      credentials: 'same-origin',
    }).then(e => e.json())
      .then(module => this.setState(() => module))
      .catch(console.error)
  }

  postDate(url, data) {
    fetch(url, {
      credentials: 'same-origin',
      method: "POST",
      body: JSON.stringify(data)
    }).then(res => {
      if (!res.ok) {
        return res.text();
      } else {
        // server doesn't send any data on a success
        // We switch from editing mode and give them the option to edit the results again
        return Promise.resolve();
      }
    });
  }

  handleClick() {
    if (this.state.editing) {
      // we have to send post requests to update the databse
      let request = [];

      Object.keys(this.updateExams).forEach(key => {
        let obj = {
          percentage: parseInt(key),
          code: this.updateExams[key]
        };
        console.log(obj)

        request.push(this.postDate('/update/exam/percentage', obj));
      });
      Promise.all([request])
        .then(console.log)
        .catch(console.error);
    }
    this.setState(prev => ({ editing: !prev.editing }));
  }

  updateCwkList(code, m, p) {
    this.updateCwks[code] = {
      marks: m,
      percentage: p
    };
    console.log(this.updateCwks);
  }

  getExam(exams) {
    return exams.map((value, index) => {
      return (
        <Row key={index}>
          <Col xs>
            <p>{value.code}</p>
          </ Col>
          <Col xs >
            {this.state.editing ? <TextField
              style={{ maxWidth: '60px' }}
              hintText={'%'}
              onChange={(e, v) => this.updateExams[value.code] = v}
              defaultValue={value.percentage}
              type={'number'} /> :
              <p>{value.percentage}</p>
            }
          </Col>
          <Col xs>
            <p>{value.type}</p>
          </ Col>
        </Row>
      );
    });
  }

  render() {
    return (
      <Grid fluid>
        <Row center="xs">
          <Col xs={12}>
            <h2>{this.state.code} {this.state.name}</h2>
          </Col>
        </Row>
        <Row>
          <Col xs={2} />
          <Col xs={8}>
            <h3>Description</h3>
            <Paper style={{ padding: 10, textAlign: 'justify' }}>
              <p>{this.state.description}</p>
            </Paper>
          </Col>
          <Col xs={2} />
        </Row>
        <br />
        <Row>
          <Col xs={2} />
          <Col xs={8}>
            <h3>Syllabus</h3>
            <Paper style={{ padding: 10, textAlign: 'justify' }}>
              <p>{this.state.syllabus}</p>
            </Paper>
          </Col>
          <Col xs={2} />
        </Row>
        <br />
        <Row start="xs">
          <Col xs={2} />
          <Col xs>
            <h3>Semester</h3>
            <p>{this.state.semester}</p>
          </ Col>
          <Col xs >
            <h3>Year</h3>
            <p>{this.state.year}</p>
          </Col>
          <Col xs>
            <h3>Credits</h3>
            <p>{this.state.credits}</p>
          </ Col>
          <Col xs={2} />
        </Row>
        <br />
        <Row start="xs">
          <Col xs={2} />
          <Col xs={8} >
            <h3>Exam:</h3>
            <RaisedButton
              style={{ cursor: "pointer" }}
              onClick={this.handleClick}
              label={this.state.editing ? "Update" : "Edit"} />
            <Divider />
            <Row>
              <Col xs>
                <p><b>Exam code</b></p>
              </ Col>
              <Col xs >
                <p><b>%</b></p>
              </Col>
              <Col xs>
                <p><b>Type</b></p>
              </ Col>
            </Row>
            {this.getExam(this.state.exam)}
          </ Col>
          <Col xs={2} />
        </Row>
        <br />
        <CwkList
          cwk={this.state.cwks}
          editing={this.state.editing}
          onChange={this.updateCwkList} />
      </Grid>
    );
  }
}

export default Module;