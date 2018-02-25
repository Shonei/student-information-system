import React, { Component } from 'react';
import { Grid, Row, Col } from 'react-flexbox-grid';
import { TextField, Divider, RaisedButton } from 'material-ui';
import CreateCwk from './CreateCwk';

class CreateModule extends Component {
  constructor(props) {
    super(props);

    this.cwk = {
      id: 0,
      name: '',
      posted_on: '',
      deadline: '',
      percentage: 0,
      marks: 0,
      description: ''
    }

    this.state = {
      code: '',
      name: '',
      description: '',
      syllabus: '',
      semester: 0,
      year_of_study: 0,
      credit: 0,
      exam: {
        code: '',
        percentage: 0,
        type: '',
        description: ''
      },
      cwks: [this.cwk]
    };

    this.createCwkList = this.createCwkList.bind(this);
    this.onCwkIdChange = this.onCwkIdChange.bind(this);
    this.onCwkNameChange = this.onCwkNameChange.bind(this);
    this.onCwkPostedOnChange = this.onCwkPostedOnChange.bind(this);
    this.onCwkDeadlineChange = this.onCwkDeadlineChange.bind(this);
    this.onCwkPercentageChange = this.onCwkPercentageChange.bind(this);
    this.onCwkDescriptionChange = this.onCwkDescriptionChange.bind(this);
    this.onCwkMarksChange = this.onCwkMarksChange.bind(this);
    this.handleCreateModule = this.handleCreateModule.bind(this);
  }

  handleCreateModule() {
    console.log(this.state);
    // fetch('/add/module', {
    //   credentials: 'same-origin',
    //   method: "POST",
    //   body: JSON.stringify(this.state),
    // })
    // .then(console.log)
    // .catch(console.log)
  }

  createCwkList(number) {
    const arr = [];

    for (let index = 0; index < number; index++) {
      const i = index;
      arr.push(<CreateCwk
        onIdChange={this.onCwkIdChange}
        onNameChange={this.onCwkNameChange}
        onPostedOnChange={this.onCwkPostedOnChange}
        onDeadlineChange={this.onCwkDeadlineChange}
        onPercentageChange={this.onCwkPercentageChange}
        onDescriptionChange={this.onCwkDescriptionChange}
        onMarksChange={this.onCwkMarksChange}
        key={i}
        index={i} />);
    }

    return arr;
  }

  onCwkIdChange(i, v) {
    this.setState(p => {
      p.cwks[i].id = parseInt(v);
      return p;
    });
  }

  onCwkNameChange(i, v) {
    this.setState(p => {
      p.cwks[i].name = v;
      return p;
    });
  }

  onCwkPostedOnChange(i, v) {
    this.setState(p => {
      p.cwks[i].posted_on = v;
      return p;
    });
  }

  onCwkDeadlineChange(i, v) {
    this.setState(p => {
      p.cwks[i].deadline = v;
      return p;
    });
  }

  onCwkPercentageChange(i, v) {
    this.setState(p => {
      p.cwks[i].percentage = parseInt(v);
      return p;
    });
  }

  onCwkDescriptionChange(i, v) {
    this.setState(p => {
      p.cwks[i].description = v;
      return p;
    });
  }

  onCwkMarksChange(i, v) {
    this.setState(p => {
      p.cwks[i].marks = parseInt(v);
      return p;
    });
  }

  render() {
    return (
      <Grid fluid>
        <Row center="xs">
          <Col xs={12}>
            <h2>Create new module</h2>
          </Col>
        </Row>
        <Row center="xs">
          <Col xs={2} />
          <Col xs>
            <TextField
              hintText="Module code"
              onChange={(e, v) => this.setState({ code: v })}
              type={"text"}
            />
          </Col>
          <Col xs>
            <TextField
              hintText="Module name"
              onChange={(e, v) => this.setState({ name: v })}
              type={"text"}
            />
          </Col>
          <Col xs={2} />
        </Row>
        <br />
        <Row center="xs">
          <Col xs={2} />
          <Col xs>
            <TextField
              hintText="Module description"
              onChange={(e, v) => this.setState({ description: v })}
              multiLine={true}
              rows={1}
              type={"text"}
              fullWidth
            />
          </Col>
          <Col xs={2} />
        </Row>
        <br />
        <Row center="xs">
          <Col xs={2} />
          <Col xs>
            <TextField
              hintText="Module syllabus"
              onChange={(e, v) => this.setState({ syllabus: v })}
              multiLine={true}
              rows={1}
              type={"text"}
              fullWidth
            />
          </Col>
          <Col xs={2} />
        </Row>
        <br />
        <Row center="xs">
          <Col xs={2} />
          <Col xs>
            <TextField
              hintText="Semester"
              onChange={(e, v) => this.setState({ semester: parseInt(v, 10) })}
              type={"number"}
            />
          </Col>
          <Col xs>
            <TextField
              hintText="Year"
              onChange={(e, v) => this.setState({ year_of_study: parseInt(v, 10) })}
              type={"number"}
            />
          </Col>
          <Col xs>
            <TextField
              hintText="Credits"
              onChange={(e, v) => this.setState({ credit: parseInt(v, 10) })}
              type={"number"}
            />
          </Col>
          <Col xs={2} />
        </Row>
        <br />
        <Row left="xs">
          <Col xs>
            <h2>Exam</h2>
            <Divider></Divider>
          </Col>
        </Row>
        <br />
        <Row center="xs">
          <Col xs={2} />
          <Col xs>
            <TextField
              hintText="Exam code"
              onChange={(e, v) => this.setState(p => {
                p.exam.code = v;
                return p;
              })}
              type={"text"}
            />
          </Col>
          <Col xs>
            <TextField
              hintText="%"
              onChange={(e, v) => this.setState(p => {
                p.exam.percentage = parseInt(v, 10);
                return p;
              })}
              type={"number"}
            />
          </Col>
          <Col xs>
            <TextField
              hintText="Type"
              onChange={(e, v) => this.setState(p => {
                p.exam.type = v;
                return p;
              })}
              type={"Text"}
            />
          </Col>
          <Col xs={2} />
        </Row>
        <br />
        <Row center="xs">
          <Col xs={2} />
          <Col xs>
            <TextField
              hintText="Exam description"
              onChange={(e, v) => this.setState(p => {
                p.exam.description = v;
                return p;
              })}
              multiLine={true}
              rows={1}
              type={"text"}
              fullWidth
            />
          </Col>
          <Col xs={2} />
        </Row>
        <br />
        <Row left="xs">
          <Col xs>
            <h2>Courseworks</h2>
          </Col>
          <Col xs>
            <RaisedButton
              label="Add coursework"
              primary={true}
              style={{ margin: 12 }}
              onClick={() => this.setState(p => {
                p.cwks.push(this.cwk);
                return p;
              })}
            />
            <RaisedButton
              label="Remove coursework"
              primary={true}
              style={{ margin: 12 }}
              onClick={() => this.setState(p => {
                p.cwks.pop(this.cwk);
                return p;
              })}
            />
          </ Col>
          <Divider></Divider>
        </Row>
        <br />
        {this.createCwkList(this.state.cwks.length)}
        <br />
        <Row center="xs">
          <Col xs>
            <RaisedButton
              label="Create Module"
              primary={true}
              style={{ margin: 12 }}
              onClick={this.handleCreateModule}
            />
          </Col>
        </Row>
      </Grid>
    );
  }
}

export default CreateModule;
