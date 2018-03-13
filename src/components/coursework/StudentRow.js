import React, { Component } from 'react';
import { Row, Col } from 'react-flexbox-grid';
import { TextField } from 'material-ui';
import PropTypes from 'prop-types';

class StudentRow extends Component {
  constructor(props) {
    super(props);

    this.state = {
      result: ' ',
      handed_in: ''
    };

    this.handleUpdateCwkResult = this.handleUpdateCwkResult.bind(this);
    this.shouldEdit = this.shouldEdit.bind(this);
  }

  componentDidMount() {
    console.log(this.props);
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
  shouldEdit(text, hint, func, type = 'number') {
    if (this.state.edit) {
      return <TextField
        name={text + ''}
        style={{ maxWidth: '100px' }}
        hintText={hint}
        onChange={func}
        defaultValue={text}
        type={type} />;
    } else {
      return <p>{text + ''}</p>;
    }
  }

  render() {
    return (
      <Row>
        <Col xs>
          <p>{this.props.student.student_id}</p>
        </ Col>
        <Col xs >
          <p>{this.props.student.username}</p>
        </Col>
        <Col xs>
          {
            this.props.edit ? <TextField
              name={'number'}
              style={{ maxWidth: '100px' }}
              hintText={'result'}
              onChange={(e, v) => {
                if (v < 0) {
                  return;
                }
                this.setState({ result: v })
                this.props.onResultChange(this.props.student.student_id, v);
              }}
              value={this.state.result}
              type={'number'} /> :
              <p>{this.state.result}</p>
          }
        </ Col>
        <Col xs>
          {
            this.props.edit ? <TextField
              name={'date'}
              style={{ maxWidth: '100px' }}
              onChange={(e, v) => {
                this.setState({v});
                this.props.onDateChange(this.props.student.student_id, v);
              }}
              defaultValue={this.state.handed_in}
              type={'date'} /> :
              <p>{new Date(this.state.handed_in).toDateString()}</p>
          }
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
