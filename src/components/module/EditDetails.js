import React, { PureComponent } from 'react';
import { Row, Col } from 'react-flexbox-grid';
import { TextField, RaisedButton } from 'material-ui';
import PropTypes from 'prop-types';
import {
  cyan900, cyan700
} from 'material-ui/styles/colors';

class EditDetails extends PureComponent {
  constructor(props) {
    super(props);

    this.hintStyle = {
      color: cyan700,
      fontSize: '20px'
    };

    this.underlineStyle = {
      borderColor: cyan900
    };

    this.state = {
      description: this.props.details.description,
      syllabus: this.props.details.syllabus,
      semester: this.props.details.semester,
      year_of_study: this.props.details.year_of_study,
      credit: this.props.details.credit
    };

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    const data = {
      code: this.props.details.code,
      description: this.state.description,
      syllabus: this.state.syllabus,
      semester: parseInt(this.state.semester, 10),
      year_of_study: parseInt(this.state.year_of_study, 10),
      credit: parseInt(this.state.credit, 10)
    };

    fetch('/update/module', {
      credentials: 'same-origin',
      method: "POST",
      body: JSON.stringify(data)
    }).then(res => {
      if (res.ok) {
        this.props.cb(data);
        return;
      }

      Promise.reject(res);
    })
      .catch(console.log);
  }

  render() {
    return (
      <div>
        <Row start="xs" around="xs">
          <Col xs={1} />
          <Col xs>
            <RaisedButton
              style={{ cursor: "pointer" }}
              onClick={this.handleClick}
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
            <TextField
              defaultValue={this.state.description}
              underlineStyle={this.underlineStyle}
              onChange={(e, v) => this.setState({ description: v })}
              multiLine={true}
              rows={1}
              type={"text"}
              fullWidth />
          </Col>
          <Col xs={1} />
        </Row>
        <br />
        <Row>
          <Col xs={1} />
          <Col xs={10}>
            <h3>Syllabus</h3>
            <TextField
              defaultValue={this.state.syllabus}
              underlineStyle={this.underlineStyle}
              onChange={(e, v) => this.setState({ syllabus: v })}
              multiLine={true}
              rows={1}
              type={"text"}
              fullWidth />
          </Col>
          <Col xs={1} />
        </Row>
        <br />
        <Row start="xs">
          <Col xs={1} />
          <Col xs>
            <h3>Semester</h3>
            <TextField
              value={this.state.semester}
              underlineStyle={this.underlineStyle}
              onChange={(e, v) => {
                if (!(v === '1' || v === '2')) {
                  return;
                }
                this.setState({ semester: v });
              }}
              type={"number"}
              fullWidth />
          </ Col>
          <Col xs >
            <h3>Year</h3>
            <TextField
              value={this.state.year_of_study}
              underlineStyle={this.underlineStyle}
              onChange={(e, v) => {
                if (parseInt(v, 10) < 0) {
                  return;
                }
                this.setState({ year_of_study: v });
              }}
              type={"number"}
              fullWidth />
          </Col>
          <Col xs>
            <h3>Credits</h3>
            <TextField
              value={this.state.credit}
              underlineStyle={this.underlineStyle}
              onChange={(e, v) => {
                if (parseInt(v, 10) < 0) {
                  return;
                }
                this.setState({ credit: v });
              }}
              type={"number"}
              fullWidth />
          </ Col>
          <Col xs={1} />
        </Row>
      </div>
    );
  }
}

EditDetails.propTypes = {
  details: PropTypes.object,
  cb: PropTypes.func,
  editing: PropTypes.bool
};

export default EditDetails;
