import React, { Component } from 'react';
import { wrapFetch as fetch } from './helpers';
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
      .then(e => {
        this.tables["current"] = e.map(elem => {
          elem.study_year = new Date(elem.study_year).getFullYear();
          return elem;
        });
      })
      .catch(err => err.text().then(console.log));

    fetch('/get/student/modules/past/', 'GET')
      .then(e => {
        this.tables["past"] = e.map(elem => {
          elem.study_year = new Date(elem.study_year).getFullYear();
          return elem;
        });
      })
      .catch(err => err.text().then(console.log));

    fetch('/get/student/cwk/results/', 'GET')
      .then(e => {
        this.tables["cwk"] = e.map(elem => {
          elem.study_year = new Date(elem.study_year).getFullYear();
          return elem;
        });
      })
      .catch(err => err.text().then(console.log));

    fetch('/get/student/cwk/timetable/', 'GET')
      .then(e => {
        e = e.map(elem => {
          elem.deadline = new Date(elem.deadline).toLocaleString();
          elem.posted_on = new Date(elem.posted_on).toLocaleString();
          return elem;
        });
        this.setState({ timetable: e });
      })
      .catch(err => err.text().then(console.log));
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
