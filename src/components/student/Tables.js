import React, { Component } from 'react';
import { wrapFetch as fetch } from './../helpers';
import { Tabs, Tab } from 'material-ui';
import CustomTable from './../CustomTable';

class Tables extends Component {
  constructor() {
    super();

    this.state = {
      value: 'current',
      timetable: [],
      error: ''
    };

    this.tables = {
      'current': [],
      'past': [],
      'cwk': []
    };

    this.handleChange = this.handleChange.bind(this);
    this.parseYear = this.parseYear.bind(this);
  }

  handleChange(e) {
    this.setState({ value: e });
  }

  // 3 of the tables have an year value that needs to be made human readable.
  // this is used by the map function to parse said year value.
  parseYear(obj) {
    obj.study_year = new Date(obj.study_year).getFullYear();
    return obj;
  }

  // get all the data from the server
  // There might be a problem where the current table doesn't render
  // as it doesn't trigget any rerenders once it is loded.
  // However the coursework results table will force the component to rerender
  // so that should render all the other tables as well.
  componentDidMount() {
    fetch('student', '/get/student/modules/now/')
      .then(e => {
        this.tables["current"] = e.map(this.parseYear);
      })
      .catch(err => this.setState({ error: 'Failed to load data. Reload pageand try again.' }));

    fetch('student', '/get/student/modules/past/')
      .then(e => {
        this.tables["past"] = e.map(this.parseYear);
      })
      .catch(err => this.setState({ error: 'Failed to load data. Reload pageand try again.' }));

    fetch('student', '/get/student/cwk/results/')
      .then(e => {
        this.tables["cwk"] = e.map(this.parseYear);
      })
      .catch(err => this.setState({ error: 'Failed to load data. Reload pageand try again.' }));

    fetch('student', '/get/student/cwk/timetable/')
      .then(e => {
        e = e.map(elem => {
          elem.deadline = new Date(elem.deadline).toDateString();
          elem.posted_on = new Date(elem.posted_on).toDateString();
          return elem;
        });
        this.setState({ timetable: e });
      })
      .catch(err => this.setState({ error: 'Failed to load data. Reload pageand try again.' }));
  }

  render() {
    return (
      <div>
        <p>{this.state.error}</p>
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
