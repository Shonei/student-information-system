import React, { Component } from 'react';
import { Row, Col } from 'react-flexbox-grid';
import { TextField, Divider } from 'material-ui';
import {
  cyan900, cyan700
} from 'material-ui/styles/colors';

class CreateCwk extends Component {
  constructor(props) {
    super(props);

    this.hintStyle = {
      color: cyan700,
      fontSize: '20px'
    };

    this.underlineStyle = {
      borderColor: cyan900
      // borderColor: '#00BCFF'
    };

    this.state = {
      index: 0,
      id: 0,
      name: '',
      posted_on: '',
      deadline: '',
      percentage: 0,
      marks: 0,
      description: ''
    };
  }

  componentDidMount() {
    this.setState(prev => {
      prev.index = this.props.index;
      prev.id = this.props.cwk.id;
      prev.name = this.props.cwk.name;
      prev.posted_on = this.props.cwk.posted_on;
      prev.deadline = this.props.cwk.deadline;
      prev.percentage = this.props.cwk.percentage;
      prev.marks = this.props.cwk.marks;
      prev.description = this.props.cwk.description;
      return prev;
    });
  }

  render() {
    return (
      <div>
        <Row center="xs">
          <Col xs={1} />
          <Col xs>
            <TextField
              floatingLabelText="Coursework ID"
              floatingLabelFixed={true}
              floatingLabelStyle={this.hintStyle}
              floatingLabelFocusStyle={this.hintStyle}
              underlineStyle={this.underlineStyle}
              onChange={(e, v) => {
                if(v < 0) {
                  return;
                }
                this.setState({ id: v });
                this.props.onIdChange(this.state.index, v);
              }}
              value={this.state.id}
              type={"number"}
              style={{ width: '100%' }}
            />
          </Col>
          <Col xs>
            <TextField
              floatingLabelText="Coursework name"
              floatingLabelFixed={true}
              floatingLabelStyle={this.hintStyle}
              floatingLabelFocusStyle={this.hintStyle}
              underlineStyle={this.underlineStyle}
              onChange={(e, v) => {
                this.setState({ name: v });
                this.props.onNameChange(this.state.index, v);
              }}
              value={this.state.name}
              type={"text"}
              style={{ width: '100%' }}
            />
          </Col>
          <Col xs>
            <TextField
              floatingLabelText="Posted on"
              floatingLabelFixed={true}
              floatingLabelStyle={this.hintStyle}
              floatingLabelFocusStyle={this.hintStyle}
              underlineStyle={this.underlineStyle}
              onChange={(e, v) => {
                this.setState({ posted_on: v });
                this.props.onPostedOnChange(this.state.index, v);
              }}
              type={"date"}
              value={this.state.posted_on}
              style={{ width: '100%' }}
            />
          </Col>
          <Col xs>
            <TextField
              floatingLabelText="Deadline"
              floatingLabelFixed={true}
              floatingLabelStyle={this.hintStyle}
              floatingLabelFocusStyle={this.hintStyle}
              underlineStyle={this.underlineStyle}
              onChange={(e, v) => {
                this.setState({ deadline: v });
                this.props.onDeadlineChange(this.state.index, v);
              }}
              type={"date"}
              value={this.state.deadline}
              style={{ width: '100%' }}
            />
          </Col>
          <Col xs={1} />
        </Row>
        <br />
        <Row center="xs">
          <Col xs={1} />
          <Col xs>
            <TextField
              floatingLabelText="Coursework %"
              floatingLabelFixed={true}
              floatingLabelStyle={this.hintStyle}
              floatingLabelFocusStyle={this.hintStyle}
              underlineStyle={this.underlineStyle}
              onChange={(e, v) => {
                if (v > 100 || v < 0) {
                  return;
                }
                this.setState({ percentage: v });
                this.props.onPercentageChange(this.state.index, v);
              }}
              value={this.state.percentage}
              type={"number"}
              style={{ width: '100%' }}
            />
          </Col>
          <Col xs>
            <TextField
              floatingLabelText="Coursework marks"
              floatingLabelFixed={true}
              underlineStyle={this.underlineStyle}
              floatingLabelStyle={this.hintStyle}
              floatingLabelFocusStyle={this.hintStyle}
              onChange={(e, v) => {
                if(v < 0) {
                  return;
                }
                this.setState({ marks: v });
                this.props.onMarksChange(this.state.index, v);
              }}
              value={this.state.marks}
              type={"number"}
              style={{ width: '100%' }}
            />
          </Col>
          <Col xs />
          <Col xs />
          <Col xs={1} />
        </Row>
        <br />
        <Row center="xs">
          <Col xs={1} />
          <Col xs>
            <TextField
              floatingLabelText="Description"
              floatingLabelFixed={true}
              underlineStyle={this.underlineStyle}
              floatingLabelStyle={this.hintStyle}
              floatingLabelFocusStyle={this.hintStyle}
              onChange={(e, v) => {
                this.setState({ description: v });
                this.props.onDescriptionChange(this.state.index, v);
              }}
              multiLine={true}
              value={this.state.description}
              rows={1}
              type={"text"}
              fullWidth
            />
          </Col>
          <Col xs={1} />
        </Row>
        <br />
        <Divider></Divider>
        <br />
      </div>
    );
  }
}

export default CreateCwk;
