import React, { Component } from 'react';
import { Row, Col } from 'react-flexbox-grid';
import PropTypes from 'prop-types';
import { RaisedButton, TextField } from 'material-ui';
import {
  cyan900, cyan700
} from 'material-ui/styles/colors';

class CourseworkTimetable extends Component {
  constructor(props) {
    super(props);

    this.underlineStyle = {
      borderColor: cyan900
    };

    this.state = {
      deadline: '',
      posted_on: '',
      editing: false,
      error: ''
    };

    this.handleTimeUpdate = this.handleTimeUpdate.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ deadline: nextProps.deadline });
    this.setState({ posted_on: nextProps.posted_on });
  }

  handleTimeUpdate() {

    fetch('/update/coursework/timetable', {
      credentials: 'same-origin',
      method: "POST",
      body: JSON.stringify({
        code: this.props.code,
        posted_on:this.state.posted_on,
        deadline: this.state.deadline
      })
    }).then(res => {
      if (!res.ok) {
        this.setState({ error: 'We were unable to update the timetable.' });
        return;
      }
    }).catch(err => {
      this.setState({ error: 'We were unable to update the timetable.' });
    });

    this.setState({ editing: false });
  }

  render() {
    // console.log(this.props);
    return (
      <Row start="xs">
        <Col xs={1} />
        <Col xs>
          <h3>Deadline</h3>
          {this.state.editing ?
            <TextField
              defaultValue={this.state.deadline}
              id={"deadline"}
              underlineStyle={this.underlineStyle}
              onChange={(e, v) => this.setState({ deadline: v })}
              rows={1}
              type={"date"} /> :
            <p>{new Date(this.state.deadline).toDateString()}</p>}
        </ Col>
        <Col xs >
          <h3>Posted on</h3>
          {this.state.editing ?
            <TextField
              defaultValue={this.state.posted_on}
              id={"posdted-on"}
              underlineStyle={this.underlineStyle}
              onChange={(e, v) => this.setState({ posted_on: v })}
              rows={1}
              type={"date"} /> :
            <p>{new Date(this.state.posted_on).toDateString()}</p>}
        </Col>
        <Col xs>
          <h3>Marks</h3>
          <p>{this.props.marks}</p>
        </ Col>
        <Col xs>
          <h3>%</h3>
          <p>{this.props.percentage}</p>
        </ Col>
        <Col xs>
          <br />
          <RaisedButton
            style={{ cursor: "pointer" }}
            onClick={this.state.editing ? this.handleTimeUpdate : () => this.setState({ editing: true })}
            primary={true}
            label={this.state.editing ? "Update" : "Edit"} />
        </ Col>
        <p>{this.state.error}</p>
        <Col xs={1} />
      </Row>
    );
  }
}

CourseworkTimetable.propTypes = {
  percentage: PropTypes.string,
  marks: PropTypes.string,
  deadline: PropTypes.string.isRequired,
  posted_on: PropTypes.string.isRequired,
  code: PropTypes.string.isRequired,
};

export default CourseworkTimetable;
