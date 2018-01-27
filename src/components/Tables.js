import React, { Component } from 'react';
import { wrapFetch as fetch } from './helpers';
import { Grid, Row, Col } from 'react-flexbox-grid';
import { Tabs, Tab } from 'material-ui';
import CustomTable from './CustomTable';

class Tables extends Component {
  constructor() {
    super();

    this.state = {
      value: 'current',
      timetable: []
    };

    this.tables = {
      'current': [],
      'past': [],
      'cwk': []
    };

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e) {
    this.setState({ value: e });
  }

  componentDidMount() {
    fetch('/get/student/modules/now/', 'GET')
      .then(e => this.tables["current"] = e)
      .catch(console.log)

    fetch('/get/student/modules/past/', 'GET')
      .then(e => this.tables["past"] = e)
      .catch(console.log)

    fetch('/get/student/cwk/results/', 'GET')
      .then(e => this.tables["cwk"] = e)
      .catch(console.log)

    fetch('/get/student/cwk/timetable/', 'GET')
      .then(e => this.setState({ timetable: e }))
      .catch(console.log)
  }

  render() {
    return (
      <div>
        <br />
        <Tabs
          value={this.state.value}
          onChange={this.handleChange}>
          <Tab label="Current modules" value="current">
            <CustomTable key="current"
              headers={['Module code', 'Name', 'Result', 'Year']}
              order={['code', 'name', 'result', 'study_year']}
              values={this.tables[this.state.value]}>
            </CustomTable>
          </Tab>
          <Tab label="Past modules" value="past">
            <CustomTable key="past"
              headers={['Module code', 'Name', 'Result', 'Year']}
              order={['code', 'name', 'result', 'study_year']}
              values={this.tables[this.state.value]}>
            </CustomTable>
          </Tab>
          <Tab label="Coursework results" value="cwk">
            <CustomTable key="cwk"
              headers={['Name', 'Module', '%', 'Marks', 'Result']}
              order={['cwk_name', 'module_code', 'percentage', 'marks', 'result']}
              values={this.tables[this.state.value]}>
            </CustomTable>
          </Tab>
        </Tabs>
        <br />
        <h2>Coursework timetable</h2>
        <CustomTable
          headers={['Coursework name', 'Posted', 'Deadline']}
          order={['cwk_name', 'posted_on', 'deadline']}
          values={this.state.timetable}>
        </CustomTable>
      </div>
    );
  }
}

export default Tables;
