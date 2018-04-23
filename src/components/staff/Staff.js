import React, { PureComponent } from 'react';
import { wrapFetch } from './../helpers';
import { Avatar, RaisedButton } from 'material-ui';
import { Grid, Row, Col } from 'react-flexbox-grid';
import CustomTable from './../CustomTable';

class Staff extends PureComponent {
  constructor() {
    super();

    this.state = {
      modules: [],
      tutees: [],
      address1: '',
      address2: '',
      email: '',
      first_name: '',
      id: '',
      last_name: '',
      middle_name: '',
      phone: '',
      error: ''
    };

    this.handleStudentClick = this.handleStudentClick.bind(this);
    this.handleModuleClick = this.handleModuleClick.bind(this);
  }

  componentDidMount() {
    wrapFetch('staff', '/get/staff/profile/')
      .then(j => this.setState(() => j))
      .catch(err => this.setState({ error: 'We failed to retrieve your profile.' }));

    wrapFetch('staff', '/get/staff/modules/')
      .then(m => {
        m = m.map(module => {
          const code = module.code;

          // creates to button to allow navigation to the module page
          module.code = <RaisedButton
            style={{ cursor: "pointer" }}
            onClick={() => this.handleModuleClick(code)}
            primary={true}
            label={code} />;

          return module;
        });
        this.setState({ modules: m });
      })
      .catch(err => this.setState({ error: 'We failed to retrieve your list of modules.' }));

    wrapFetch('staff', '/get/staff/tutees/')
      .then(val => {
        val = val.map(student => {
          // move the uesrname to a new variable so we don't lose his username
          const user = student.username;

          // creates a button to allow navigation to students home pages
          student.username = <RaisedButton
            style={{ cursor: "pointer" }}
            onClick={() => this.handleStudentClick(user)}
            primary={true}
            label={user} />;

          return student;
        });
        this.setState({ tutees: val });
      })
      .catch(err => this.setState({ error: 'We failed to retrieve your list of tutees.' }));
  }

  handleStudentClick(username) {
    window.sessionStorage.setItem('student', username);
    window.location.href = '/student';
  }


  handleModuleClick(id) {
    window.sessionStorage.setItem('module', id);
    window.location.href = '/module';
  }

  render() {
    const fullName = this.state.first_name + ' ' + this.state.middle_name + ' ' + this.state.last_name;
    const URL = "https://github.com/Shonei/student-information-system/blob/master/database.jpg?raw=true";

    return (
      <Grid fluid>
        <Row center="xs">
          <Col xs={12} md={3}>
            <Avatar src={URL}
              size={180} />
          </Col>
          <Col xs={12} md={3}>
            <p><b>Full name: </b>{fullName}</p>
            <p><b>ID: </b>{this.state.id}</p>
            <p><b>Address: </b>{this.state.address1 + ' ' + this.state.address2}</p>
            <p><b>Email: </b>{this.state.email}</p>
            <p><b>Phone: </b>{this.state.phone}</p>
          </Col>
        </Row>
        <br />
        <Row center="xs">
          <Col xs>
            <p>{this.state.error}</p>
          </Col>
        </Row>
        <br />
        <h3><b>My modules:</b></h3>
        <CustomTable
          headers={['Code', 'Name', 'Role']}
          order={['code', 'name', 'staff_role']}
          values={this.state.modules}
        ></CustomTable>
        <br />
        <br />
        <h3><b>My tutees:</b></h3>
        <CustomTable
          headers={['Username', 'ID', 'Programme', 'Year']}
          order={['username', 'id', 'programme_code', 'year']}
          values={this.state.tutees}
        ></CustomTable>
      </Grid>
    );
  }
}

export default Staff;
