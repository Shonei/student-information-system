import React, { PureComponent } from 'react';
import { Grid, Row, Col } from 'react-flexbox-grid';
import { Paper } from 'material-ui';
import StudentList from './StudentList';

class Coursewok extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      name: '',
      id: '',
      description: '',
      marks: '',
      percentage: '',
      module_code: '',
      deadline: '',
      posted_on: '',
    };

  }

  componentDidMount() {
    let courseworkId = window.sessionStorage.getItem('coursework');

    fetch('/get/cwk/' + courseworkId, {
      method: 'GET',
      credentials: 'same-origin',
    }).then(e => e.json())
      .then(e => this.setState(() => e[0]))
      .catch(console.error)
  }

  render() {
    return (
      <Grid fluid>
        <Row center="xs">
          <Col xs={12}>
            <h2>{this.state.id} {this.state.name}</h2>
          </Col>
        </Row>
        <Row>
          <Col xs={1} />
          <Col xs={10}>
            <h3>Description</h3>
            <Paper style={{ padding: 10, textAlign: 'justify' }}>
              <p>{this.state.description}</p>
            </Paper>
          </Col>
          <Col xs={1} />
        </Row>
        <br />
        <Row start="xs">
          <Col xs={1} />
          <Col xs>
            <h3>Deadline</h3>
            <p>{new Date(this.state.deadline).toDateString()}</p>
          </ Col>
          <Col xs >
            <h3>Posted on</h3>
            <p>{new Date(this.state.posted_on).toDateString()}</p>
          </Col>
          <Col xs>
            <h3>Marks</h3>
            <p>{this.state.marks}</p>
          </ Col>
          <Col xs>
            <h3>%</h3>
            <p>{this.state.percentage}</p>
          </ Col>
          <Col xs={1} />
        </Row>
        <br />
        <Row start="xs">
          <Col xs>
            <StudentList />
          </ Col>
        </Row>
      </Grid>
    );
  }
}

export default Coursewok;
