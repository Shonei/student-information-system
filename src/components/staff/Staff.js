import React, { PureComponent } from 'react';
import { wrapFetch } from './../helpers';
import { Avatar, FlatButton } from 'material-ui';
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
      errorMessage: ''
    };

    this.handleStudentClick = this.handleStudentClick.bind(this);
    this.handleModuleClick = this.handleModuleClick.bind(this);
  }

  componentDidMount() {
    wrapFetch('staff', '/get/staff/profile/')
      .then(j => this.setState(() => j))
      .catch(console.log);

    wrapFetch('staff', '/get/staff/modules/')
      .then(m => {
        m = m.map(module => {
          const code = module.code;
          module.code = <FlatButton style={{ cursor: "pointer" }} onClick={() => this.handleModuleClick(code)} label={code} />;
          return module;
        });
        this.setState({ modules: m });
      })
      .catch(console.log);

    wrapFetch('staff', '/get/staff/tutees/')
      .then(val => {
        val = val.map(student => {
          const user = student.username;
          student.username = <FlatButton style={{ cursor: "pointer" }} onClick={() => this.handleStudentClick(user)} label={user} />;
          return student;
        });
        this.setState({ tutees: val });
      })
      .catch(console.log);
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
    console.log('sdgdsg')
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
        <br />
        <h3><b>Modules:</b></h3>
        <CustomTable
          headers={['Code', 'Name', 'Role']}
          order={['code', 'name', 'staff_role']}
          values={this.state.modules}
        ></CustomTable>
        <br />
        <br />
        <h3><b>Tutoring:</b></h3>
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
