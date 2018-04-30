import React, { Component } from 'react';
import { Row, Col } from 'react-flexbox-grid';
import { RaisedButton, TextField, Divider, DropDownMenu, MenuItem } from 'material-ui';
import { orange500, cyan700 } from 'material-ui/styles/colors';

class Staff extends Component {
  constructor(props) {
    super(props);

    this.borderStyle = {
      borderColor: orange500,
      borderWidth: '2px'
    };

    this.hintStyle = {
      color: cyan700,
      fontSize: '20px'
    };

    this.code = window.sessionStorage.getItem('module');

    this.state = {
      editing: false,
      staff: [],
      newStaff: '',
      role: 'leading',
      error: ''
    };

    this.handleClick = this.handleClick.bind(this);
    this.getRows = this.getRows.bind(this);
    this.handleRemove = this.handleRemove.bind(this);
  }

  componentDidMount() {
    fetch('/get/module/staff/' + this.code)
      .then(res => {
        if (!res.ok) {
          return Promise.reject(res);
        }
        return res.json();
      })
      .then(data => this.setState({ staff: data }))
      .catch(err => this.setState({ error: 'Failed to load data. Reload pageand try again.' }));
  }

  handleClick() {
    if (!this.state.editing) {
      this.setState({ editing: true });
    } else {
      this.setState({ editing: false });
      if (this.state.newStaff === '') {
        return;
      }

      fetch('/add/module/staff', {
        credentials: 'same-origin',
        method: "POST",
        body: JSON.stringify({
          staff_id: parseInt(this.state.newStaff, 10),
          module_code: this.code,
          staff_role: this.state.role
        })
      }).then(res => {
        if (!res.ok) {
          return Promise.reject(res);
        }

        window.location.reload();
      }).catch(err => this.setState({ error: 'Failed to add new staff member. Make sure the ID is correct.' }));
    }
  }

  // handles removing a prerequisite from a module
  handleRemove(staff_id, index) {
    fetch('/remove/module/staff', {
      credentials: 'same-origin',
      method: "POST",
      body: JSON.stringify({
        module_code: this.code,
        staff_id: parseInt(staff_id, 10)
      })
    }).then(res => {
      if (!res.ok) {
        return Promise.reject(res);
      }

      this.setState(prev => {
        prev.staff.splice(index, 1);
        return prev;
      });
    }).catch(err => this.setState({ error: 'Failed to remove staff member. Try again in a few minutes.' }));
  }

  // creates a row for a prerequise
  // it will have its code and name and a button to remove it if needed
  getRows(staff) {
    return staff.map((val, i) => {
      return (
        <Row key={val.id}>
          <Col xs >
            <p>{val.id}</p>
          </Col>
          <Col xs >
            <p>{val.name}</p>
          </Col>
          <Col xs >
            <p>{val.role}</p>
          </Col>
          <Col xs>
            <RaisedButton
              style={{ cursor: "pointer" }}
              onClick={() => this.handleRemove(val.id, i)}
              primary={true}
              label={"Remove staff"} />
          </ Col>
        </Row>);
    });
  }

  render() {
    return (
      <div>
        <br />
        <Row start="xs" around="xs">
          <Col xs={1} />
          <Col xs>
            <Row around="xs">
              <Col xs>
                <h2>Staff members:</h2>
              </Col>
              <Col xs>
                <RaisedButton
                  style={{ cursor: "pointer" }}
                  onClick={this.handleClick}
                  primary={true}
                  label={this.state.editing ? "Add" : "Add staff member"} />
              </ Col>
              <Col xs>
                {this.state.editing ?
                  <TextField
                    value={this.state.newStaff}
                    style={{ maxWidth: '100%' }}
                    floatingLabelText={"Staff ID"}
                    floatingLabelFixed={true}
                    floatingLabelStyle={this.hintStyle}
                    floatingLabelFocusStyle={this.hintStyle}
                    onChange={(e, v) => {
                      if (v.match(/^$|^[0-9]*$/) != null) {
                        this.setState({ newStaff: v });
                      }
                    }}
                    underlineStyle={this.borderStyle}
                    underlineFocusStyle={this.borderStyle}
                    type={'text'} /> :
                  <div />}
              </ Col>
              <Col xs>
                {this.state.editing ?
                  <DropDownMenu
                    underlineStyle={this.borderStyle}
                    value={this.state.role}
                    onChange={(e, i, val) => this.setState({ role: val })}>
                    <MenuItem value={"leading"} primaryText="Module leader" />
                    <MenuItem value={"teaching"} primaryText="Support staff" />
                  </DropDownMenu> :
                  <div />}
              </ Col>
            </Row>
            <br />
            <p>{this.state.error}</p>
            <Divider />
            <Row>
              <Col xs>
                <p><b>Staff ID</b></p>
              </ Col>
              <Col xs >
                <p><b>Name</b></p>
              </Col>
              <Col xs >
                <p><b>Role</b></p>
              </Col>
              <Col xs />
            </Row>
          </ Col>
          <Col xs={1} />
        </Row>
        <br />
        <Row start="xs" >
          <Col xs={1} />
          <Col xs={10}>
            {this.getRows(this.state.staff)}
          </ Col>
          <Col xs={1} />
        </Row>
      </ div>
    );
  }
}

export default Staff;
