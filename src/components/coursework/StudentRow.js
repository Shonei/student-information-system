import React, { PureComponent } from 'react';
import { Row, Col } from 'react-flexbox-grid';
import { RaisedButton, TextField } from 'material-ui';
import PropTypes from 'prop-types';

class StudentRow extends PureComponent {
  constructor() {
    super();

    this.state = {
      result: ' ',
      handed_in: '',
      edit: false
    };

    this.handleUpdateCwkResult = this.handleUpdateCwkResult.bind(this);
    this.shouldEdit = this.shouldEdit.bind(this);
  }

  componentDidMount() {
    // if the results are vailable we make the option to edit them available
    // if the results are missing we just give the option to update them by default
    if (!this.props.student.result) {
      this.setState({ edit: true });
    }
    
    // we copy the props onto the state so we can edit it freely
    this.setState({ result: this.props.student.result });
    this.setState({ handed_in: this.props.student.handed_in });
  }

  handleUpdateCwkResult() {
    // The data the server needs to update the coursework results
    let data = {
      student_id: parseInt(this.props.student.student_id, 10),
      cwk_id: parseInt(this.props.cwkID, 10),
      result: parseInt(this.state.result, 10),
      handed_in: this.state.handed_in
    };

    fetch('/update/cwk/results', {
      credentials: 'same-origin',
      method: "POST",
      body: JSON.stringify(data)
    }).then(res => {
      if (!res.ok) {
        return res.text();
      } else {
        // server doesn't send any data on a success
        // We switch from editing mode and give them the option to edit the results again
        this.setState({ edit: false });
      }
    }).catch(console.log)
  }

  // Based on wheter or not the user is editing the the result or the data
  // this function will return either a paragraph showing the results or a
  // TextField that is used to input the new results.
  // If the user is changing existing results the fiels will display them as default values. 
  shouldEdit(text, hint, func, type = 'text') {
    if (this.state.edit) {
      return <TextField
        name={text + ''}
        hintText={hint}
        onChange={func}
        defaultValue={text}
        type={type} />;
    } else {
      return <p>{text + ''}</p>;
    }
  }

  render() {
    const date = new Date(this.state.handed_in).toDateString();
    return (
      <Row>
        <Col xs>
          <p>{this.props.student.student_id}</p>
        </ Col>
        <Col xs >
          <p>{this.props.student.username}</p>
        </Col>
        <Col xs>
          {this.shouldEdit(this.state.result, "result", (o, e) => this.setState({ result: e }))}
        </ Col>
        <Col xs>
          {this.shouldEdit(date, "", (o, e) => this.setState({ handed_in: e }), "date")}
        </ Col>
        <Col xs>
          <RaisedButton
            label={this.state.edit ? "Update" : "Edit"}
            primary={true}
            style={{ margin: 12 }}
            onClick={this.state.edit ? this.handleUpdateCwkResult : () => this.setState({ edit: true })}
          />
        </ Col>
      </Row>
    );
  }
}

StudentRow.propTypes = {
  student: PropTypes.object.isRequired,
  cwkID: PropTypes.number.isRequired
};

export default StudentRow;
