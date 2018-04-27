import React, { PureComponent } from 'react';
import { Row, Col } from 'react-flexbox-grid';
import { RaisedButton } from 'material-ui';
import PropTypes from 'prop-types';

class StudentRow extends PureComponent {
  constructor(props) {
    super(props);

    this.handleRemove = this.handleRemove.bind(this);
  }

  handleRemove() {
    fetch('/remove/module/student', {
      credentials: 'same-origin',
      method: "POST",
      body: JSON.stringify({
        student_id: parseInt(this.props.id, 10),
        module_code: this.props.code
      })
    }).then(res => {
      if (!res.ok) {
        this.props.onFail(res);
        return;
      }

      this.props.onSuccess(res);
    }).catch(err => {
      this.props.onFail(err);
    });
  }

  render() {
    return (
      <Row>
        <Col xs >
          <p>{this.props.id}</p>
        </Col>
        <Col xs >
          <p>{this.props.username}</p>
        </Col>
        <Col xs>
          <RaisedButton
            style={{ cursor: "pointer" }}
            onClick={this.handleRemove}
            primary={true}
            label={"Remove student"} />
        </ Col>
      </Row>
    );
  }
}

StudentRow.propTypes = {
  id: PropTypes.string.isRequired,
  username: PropTypes.string.isRequired,
  code: PropTypes.string.isRequired,
  onFail: PropTypes.func,
  onSuccess: PropTypes.func
};

export default StudentRow;
