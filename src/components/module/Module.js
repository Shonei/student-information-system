import React, { PureComponent } from 'react';
import { Grid, Row, Col } from 'react-flexbox-grid';
import { Paper, Divider } from 'material-ui';
import CwkList from './CwkList';

class Module extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      exam: [],
      cwks: []
    };

    this.getExam = this.getExam.bind(this);
  }

  componentDidMount() {
    let moduleId = window.sessionStorage.getItem('module');
    // FIX THIS
    fetch('/get/module/' + '25351', {
      method: 'GET',
      credentials: 'same-origin',
    }).then(e => e.json())
      .then(module => this.setState(() => module))
      .catch(console.error)
  }

  getExam(exams) {
    console.log(exams);
    return exams.map((value, index) => {
      return (
        <Row key={index}>
          <Col xs>
            <p>{value.code}</p>
          </ Col>
          <Col xs >
            <p>{value.percentage}</p>
          </Col>
          <Col xs>
            <p>{value.type}</p>
          </ Col>
        </Row>
      );
    });
  }

  render() {
    console.log(this.state)
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
        <CwkList cwk={this.state.cwks} />
      </Grid>
    );
  }
}

export default Module;
