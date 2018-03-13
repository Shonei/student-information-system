import React, { Component } from 'react';
import { Grid, Row, Col } from 'react-flexbox-grid';
import { TextField, Divider, RaisedButton } from 'material-ui';
import CreateCwk from './CreateCwk';
import {
  cyan900, cyan700
} from 'material-ui/styles/colors';

class CreateModule extends Component {
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

    this.cwk = {
      id: 0,
      name: '',
      posted_on: '',
      deadline: '',
      percentage: 0,
      marks: 0,
      description: ''
    };

    this.state = {
      code: '',
      name: '',
      description: '',
      syllabus: '',
      semester: 1,
      year_of_study: 1,
      credit: 0,
      exam: {
        code: '',
        percentage: 0,
        type: '',
        description: ''
      },
      // make copy of the object so we pass a new reference
      cwks: [Object.assign({}, this.cwk)]
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
    fetch('/add/module', {
      credentials: 'same-origin',
      method: "POST",
      body: JSON.stringify(this.state),
    })
    .then(res => {
      if(res.ok) {
        window.sessionStorage.setItem('module', this.state.code);
        window.location.href = '/module';
      } else {
        Promise.reject('creation failed');
      }
    })
    .catch(console.log)
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
        cwk={this.state.cwks[index]}
        key={i}
        index={i} />);
    }

    return arr;
  }

  onCwkIdChange(i, v) {
    this.setState(p => {
      console.log(i);
      p.cwks[i].id = parseInt(v, 10);
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
      p.cwks[i].percentage = parseInt(v, 10);
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
      p.cwks[i].marks = parseInt(v, 10);
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
          <Col xs={1} />
          <Col xs>
            <TextField
              floatingLabelText="Module code"
              floatingLabelFixed={true}
              floatingLabelStyle={this.hintStyle}
              floatingLabelFocusStyle={this.hintStyle}
              underlineStyle={this.underlineStyle}
              onChange={(e, v) => this.setState({ code: v })}
              type={"text"}
            />
          </Col>
          <Col xs>
            <TextField
              floatingLabelText="Module name"
              floatingLabelFixed={true}
              floatingLabelStyle={this.hintStyle}
              floatingLabelFocusStyle={this.hintStyle}
              underlineStyle={this.underlineStyle}
              onChange={(e, v) => this.setState({ name: v })}
              type={"text"}
            />
          </Col>
          <Col xs={1} />
        </Row>
        <br />
        <Row center="xs">
          <Col xs={1} />
          <Col xs>
            <TextField
              floatingLabelText="Module description"
              floatingLabelFixed={true}
              floatingLabelStyle={this.hintStyle}
              floatingLabelFocusStyle={this.hintStyle}
              underlineStyle={this.underlineStyle}
              onChange={(e, v) => this.setState({ description: v })}
              multiLine={true}
              rows={1}
              type={"text"}
              fullWidth
            />
          </Col>
          <Col xs={1} />
        </Row>
        <br />
        <Row center="xs">
          <Col xs={1} />
          <Col xs>
            <TextField
              floatingLabelText="Module syllabus"
              floatingLabelFixed={true}
              floatingLabelStyle={this.hintStyle}
              floatingLabelFocusStyle={this.hintStyle}
              underlineStyle={this.underlineStyle}
              onChange={(e, v) => this.setState({ syllabus: v })}
              multiLine={true}
              rows={1}
              type={"text"}
              fullWidth
            />
          </Col>
          <Col xs={1} />
        </Row>
        <br />
        <Row center="xs">
          <Col xs={1} />
          <Col xs>
            <TextField
              value={String(this.state.semester)}
              floatingLabelText="Semester"
              floatingLabelFixed={true}
              floatingLabelStyle={this.hintStyle}
              floatingLabelFocusStyle={this.hintStyle}
              underlineStyle={this.underlineStyle}
              onChange={(e, v) => {
                const s = parseInt(v, 10);
                if(s !== 1 && s !== 2) {
                  return;
                }
                this.setState({ semester: s });
              }}
              type={"number"}
            />
          </Col>
          <Col xs>
            <TextField
              value={String(this.state.year_of_study)}
              floatingLabelText="Year"
              floatingLabelFixed={true}
              floatingLabelStyle={this.hintStyle}
              floatingLabelFocusStyle={this.hintStyle}
              underlineStyle={this.underlineStyle}
              onChange={(e, v) => {
                const year = parseInt(v, 10);
                console.log(year);
                if(year < 0 || year > 6) {
                  return;
                }
                this.setState({ year_of_study: year });
              }}
              type={"number"}
            />
          </Col>
          <Col xs>
            <TextField
              value={String(this.state.credit)}
              floatingLabelText="Credits"
              floatingLabelFixed={true}
              floatingLabelStyle={this.hintStyle}
              floatingLabelFocusStyle={this.hintStyle}
              underlineStyle={this.underlineStyle}
              onChange={(e, v) => {
                if(v < 0) {
                  // module can't have negative cradits
                  return;
                }
                this.setState({ credit: parseInt(v, 10) });
              }}
              type={"number"}
            />
          </Col>
          <Col xs={1} />
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
          <Col xs={1} />
          <Col xs>
            <TextField
              floatingLabelText="Exam code"
              floatingLabelFixed={true}
              floatingLabelStyle={this.hintStyle}
              floatingLabelFocusStyle={this.hintStyle}
              underlineStyle={this.underlineStyle}
              onChange={(e, v) => this.setState(p => {
                p.exam.code = v;
                return p;
              })}
              type={"text"}
            />
          </Col>
          <Col xs>
            <TextField
              value={this.state.exam.percentage}
              floatingLabelText="Exam %"
              floatingLabelFixed={true}
              floatingLabelStyle={this.hintStyle}
              floatingLabelFocusStyle={this.hintStyle}
              underlineStyle={this.underlineStyle}
              onChange={(e, v) => this.setState(p => {
                p.exam.percentage = parseInt(v, 10);
                return p;
              })}
              type={"number"}
            />
          </Col>
          <Col xs>
            <TextField
              floatingLabelText="Exam type"
              floatingLabelFixed={true}
              floatingLabelStyle={this.hintStyle}
              floatingLabelFocusStyle={this.hintStyle}
              underlineStyle={this.underlineStyle}
              onChange={(e, v) => this.setState(p => {
                p.exam.type = v;
                return p;
              })}
              type={"Text"}
            />
          </Col>
          <Col xs={1} />
        </Row>
        <br />
        <Row center="xs">
          <Col xs={1} />
          <Col xs>
            <TextField
              floatingLabelText="Exam description"
              floatingLabelFixed={true}
              floatingLabelStyle={this.hintStyle}
              floatingLabelFocusStyle={this.hintStyle}
              underlineStyle={this.underlineStyle}
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
          <Col xs={1} />
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
                p.cwks.push(Object.assign({}, this.cwk));
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
          <Divider />
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
