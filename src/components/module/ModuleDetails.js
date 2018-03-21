import React, { PureComponent } from 'react';
import { Row, Col } from 'react-flexbox-grid';
import { Paper, RaisedButton } from 'material-ui';
import PropTypes from 'prop-types';

class ModuleDetails extends PureComponent {
  render() {
    return (
      <div>
        <Row start="xs" around="xs">
          <Col xs={1} />
          <Col xs>
            <RaisedButton
              style={{ cursor: "pointer" }}
              onClick={this.props.cb}
              primary={true}
              label={this.props.editing ? "Update" : "Edit module details"} />
          </ Col>
          <Col xs={1} />
        </Row>
        <br />
        <Row center="xs">
          <Col xs={12}>
            <h2>{this.props.details.code} {this.props.details.name}</h2>
          </Col>
        </Row>
        <Row>
          <Col xs={1} />
          <Col xs={10}>
            <h3>Description</h3>
            <Paper style={{ padding: 10, textAlign: 'justify' }}>
              <p>{this.props.details.description}</p>
            </Paper>
          </Col>
          <Col xs={1} />
        </Row>
        <br />
        <Row>
          <Col xs={1} />
          <Col xs={10}>
            <h3>Syllabus</h3>
            <Paper style={{ padding: 10, textAlign: 'justify' }}>
              <p>{this.props.details.syllabus}</p>
            </Paper>
          </Col>
          <Col xs={1} />
        </Row>
        <br />
        <Row start="xs">
          <Col xs={1} />
          <Col xs>
            <h3>Semester</h3>
            <p>{this.props.details.semester}</p>
          </ Col>
          <Col xs >
            <h3>Year</h3>
            <p>{this.props.details.year_of_study}</p>
          </Col>
          <Col xs>
            <h3>Credits</h3>
            <p>{this.props.details.credit}</p>
          </ Col>
          <Col xs={1} />
        </Row>
      </div>
    );
  }
}

ModuleDetails.propTypes = {
  details: PropTypes.object,
  cb: PropTypes.func,
  editing: PropTypes.bool
};

export default ModuleDetails;
