import React, { PureComponent } from 'react';
import { Row, Col } from 'react-flexbox-grid';
import { RaisedButton, TextField, Divider } from 'material-ui';
import PropTypes from 'prop-types';
import { orange500, cyan700 } from 'material-ui/styles/colors';

class Prerequisites extends PureComponent {
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

    this.state = {
      editing: false,
      prerequisite: ''
    };

    this.handleClick = this.handleClick.bind(this);
    this.getRows = this.getRows.bind(this);
    this.handleRemove = this.handleRemove.bind(this);
  }

  handleClick() {
    if (!this.state.editing) {
      this.setState({ editing: true });
    } else {
      this.setState({ editing: false });
      if (this.state.prerequisite === '') {
        return;
      }

      fetch('/add/prerequisite', {
        credentials: 'same-origin',
        method: "POST",
        body: JSON.stringify({
          code: this.props.moduleCode,
          prerequisites: this.state.prerequisite
        })
      }).then(res => {
        if (!res.ok) {
          return res.text();
        } else {
          // server doesn't send any data on a success
          // We switch from editing mode and give them the option to edit the results again
          // data.type = type;
          // return Promise.resolve(res);
        }
      });
    }
  }

  // handles removing a prerequisite from a module
  handleRemove(code, pre) {
    fetch('/remove/prerequisite', {
      credentials: 'same-origin',
      method: "POST",
      body: JSON.stringify({
        code: code,
        to_be_removed: pre
      })
    }).then(res => {
      if (!res.ok) {
        return res.text();
      } else { }
    });
  }

  // creates a row for a prerequise
  // it will have its code and name and a button to remove it if needed
  getRows(modules) {
    return modules.map(m => {
      return (
        <Row key={m.code}>
          <Col xs >
            <p>{m.code}</p>
          </Col>
          <Col xs >
            <p>{m.Name}</p>
          </Col>
          <Col xs>
            <RaisedButton
              style={{ cursor: "pointer" }}
              onClick={() => this.handleRemove(this.props.moduleCode, m.code)}
              primary={true}
              label={"Remove prerequisite"} />
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
                <h2>Prerequisites:</h2>
              </Col>
              <Col xs>
                <RaisedButton
                  style={{ cursor: "pointer" }}
                  onClick={this.handleClick}
                  primary={true}
                  label={this.state.editing ? "Add" : "Add prerequisite"} />
              </ Col>
              <Col xs>
                {this.state.editing ?
                  <TextField
                    style={{ maxWidth: '100%' }}
                    floatingLabelText={"Prerequisite module code"}
                    floatingLabelFixed={true}
                    floatingLabelStyle={this.hintStyle}
                    floatingLabelFocusStyle={this.hintStyle}
                    onChange={(e, v) => this.setState({ prerequisite: v })}
                    underlineStyle={this.borderStyle}
                    underlineFocusStyle={this.borderStyle}
                    type={'text'} /> :
                  <div />}
              </ Col>
            </Row>
            <Divider />
            <Row>
              <Col xs>
                <p><b>Code</b></p>
              </ Col>
              <Col xs >
                <p><b>Name</b></p>
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
            {this.getRows(this.props.prerequisites)}
          </ Col>
          <Col xs={1} />
        </Row>
      </ div>
    );
  }
}

Prerequisites.propTypes = {
  prerequisites: PropTypes.array.isRequired,
  moduleCode: PropTypes.string
};

export default Prerequisites;
