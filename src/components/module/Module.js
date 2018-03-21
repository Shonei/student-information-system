import React, { Component } from 'react';
import { Grid, Row, Col } from 'react-flexbox-grid';
import { Paper, Divider, RaisedButton, TextField } from 'material-ui';
import CwkList from './CwkList';
import Prerequisites from './Prerequisites';
import ModuleDetails from './ModuleDetails';
import EditDetails from './EditDetails';
import { orange500 } from 'material-ui/styles/colors';

class Module extends Component {
  constructor(props) {
    super(props);

    this.borderStyle = {
      borderColor: orange500,
      borderWidth: '2px'
    };

    this.state = {
      exam: {},
      cwks: [],
      prerequisites: [],
      editing: false,
      editModuleDetails: false
    };

    this.updateCwks = {};

    this.updateCwkList = this.updateCwkList.bind(this);
    this.getExam = this.getExam.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.postData = this.postData.bind(this);
    this.handleModuleUpdate = this.handleModuleUpdate.bind(this);
  }

  componentDidMount() {
    let moduleId = window.sessionStorage.getItem('module');

    fetch('/get/module/' + moduleId, {
      method: 'GET',
      credentials: 'same-origin',
    }).then(e => e.json())
      .then(m => this.setState(() => {
        console.log(m)

        // the module might not have an exam assotiated with it
        if (m.exam) {
          m.exam = m.exam[0];
        }
        return m;
      }))
      .catch(console.error);
  }

  postData(url, data, type) {
    return fetch(url, {
      credentials: 'same-origin',
      method: "POST",
      body: JSON.stringify(data)
    }).then(res => {
      if (!res.ok) {
        return res.text();
      } else {
        // server doesn't send any data on a success
        // We switch from editing mode and give them the option to edit the results again
        data.type = type;
        return Promise.resolve(data);
      }
    });
  }

  handleClick() {
    if (this.state.editing) {
      // array to hold all the post promises
      let request = [];

      // send a post for the exam update
      request.push(this.postData('/update/exam/percentage', this.state.exam, 'exam'));

      // post all cwk updates
      Object.keys(this.updateCwks).forEach(key => {
        let obj = {
          id: parseInt(key, 10),
          marks: parseInt(this.updateCwks[key].marks, 10),
          percentage: parseInt(this.updateCwks[key].percentage, 10)
        };

        request.push(this.postData('/update/cwk/percentage', obj, 'cwk'));
      });

      // wait for all request to resolve to update the state
      Promise.all(request)
        .then(arr => {
          arr.forEach(val => {

            // we update all the cwk % with the new values on success
            if (val.type === 'cwk') {

              // find the cwk
              let index = this.state.cwks.findIndex(v => v.id === val.id);
              if (index > -1) {
                this.setState(prev => {
                  prev.cwks[index].percentage = val.percentage;
                  prev.cwks[index].marks = val.marks;
                  return prev;
                });
              }
            }
          });
        })
        .catch(console.error);
    }
    this.setState(prev => ({ editing: !prev.editing }));
  }

  updateCwkList(code, m, p) {
    this.updateCwks[code] = {
      marks: m,
      percentage: p
    };
  }

  getExam(value) {
    // empty object check
    if (!value) {
      return;
    }

    value.percentage = value.percentage ? value.percentage : 0;

    return (
      <Row >
        <Col xs>
          <p>{value.code}</p>
        </ Col>
        <Col xs >
          {/* depending on state.editing we return a text field or a p tag to show the value */}
          {this.state.editing ? <TextField
            id={parseInt(Math.random() * 10, 10) + ''}
            style={{ maxWidth: '100px' }}
            onChange={(e, v) => {
              this.setState(prev => {
                // control the upper and lower bounds of the % 
                if (v < 0 || v > 100) {
                  return prev;
                }
                prev.exam.code = value.code;
                prev.exam.percentage = parseInt(v, 10);
                prev.examErr = '';
                return prev;
              });
            }}
            value={value.percentage}
            underlineStyle={this.borderStyle}
            underlineFocusStyle={this.borderStyle}
            type={'number'} /> :
            <p>{value.percentage}</p>
          }
        </Col>
        <Col xs>
          <p>{value.type}</p>
        </ Col>
      </Row>
    );
  }

  handleModuleUpdate(m) {
    this.setState(prev => {
      prev.description = m.description;
      prev.syllabus = m.syllabus;
      prev.credits = m.credit;
      prev.semester = m.semester;
      prev.year = m.year_of_study;
      return prev;
    });
    this.setState({ editModuleDetails: !this.state.editModuleDetails });
  }

  render() {
    const details = {
      code: this.state.code,
      description: this.state.description,
      syllabus: this.state.syllabus,
      semester: this.state.semester,
      year_of_study: this.state.year,
      credit: this.state.credits,
      name: this.state.name
    };

    return (
      <Grid fluid>
        {
          this.state.editModuleDetails
            ? <EditDetails
              cb={this.handleModuleUpdate}
              editing={this.state.editModuleDetails}
              details={details} />
            : <ModuleDetails
              cb={() => this.setState({ editModuleDetails: !this.state.editModuleDetails })}
              editing={this.state.editModuleDetails}
              details={details} />
        }
        <br />
        <Prerequisites
          moduleCode={this.state.code}
          prerequisites={this.state.prerequisites} />
        <br />
        <Row start="xs" around="xs">
          <Col xs={1} />
          <Col xs>
            <Row around="xs">
              <Col xs>
                <h2>Assesment:</h2>
              </Col>
              <Col xs>
                <RaisedButton
                  style={{ cursor: "pointer" }}
                  onClick={this.handleClick}
                  primary={true}
                  label={this.state.editing ? "Update" : "Edit %"} />
              </ Col>
            </Row>
            <Divider />
          </ Col>
          <Col xs={1} />
        </Row>
        <Row>
        </Row>
        <br />
        <Row start="xs">
          <Col xs={1} />
          <Col xs={10} >
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
          <Col xs={1} />
        </Row>
        <br />
        <CwkList
          cwk={this.state.cwks}
          editing={this.state.editing}
          onChange={this.updateCwkList} />
      </Grid >
    );
  }
}

export default Module;
