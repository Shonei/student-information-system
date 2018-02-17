import React, { PureComponent } from 'react';
import { Grid, Row, Col } from 'react-flexbox-grid';
import { Divider } from 'material-ui';

class StudentList extends PureComponent {
  componentDidMount() {
    fetch('/get/cwk/' + 71573, {
      method: 'GET',
      credentials: 'same-origin',
    }).then(e => e.json())
      .then(e => this.setState(() => e[0]))
      .catch(console.error)
  }

  render() {
    return (
      <Grid fluid>
        <Row>
          <Col xs={2} />
          <Col xs={8}>
            <h2>Students</h2>
          </Col>
          <Col xs={2} />
        </Row>
        <Row start="xs">
          <Col xs={2} />
          <Divider />
          <Col xs>
            <h3>Deadline</h3>
            <p>{}</p>
          </ Col>
          <Col xs >
            <h3>Posted on</h3>
            <p>{}</p>
          </Col>
          <Col xs>
            <h3>Marks</h3>
            <p>{}</p>
          </ Col>
          <Col xs>
            <h3>%</h3>
            <p>{}</p>
          </ Col>
          <Col xs={2} />
        </Row>
      </Grid>
    );
  }
}

export default StudentList;
