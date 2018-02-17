import React, { PureComponent } from 'react';
import { Row, Col } from 'react-flexbox-grid';
import { Divider, FlatButton } from 'material-ui';
import PropTypes from 'prop-types';

class CwkList extends PureComponent {
  constructor(props) {
    super(props);

    this.handleCwkClick = this.handleCwkClick.bind(this);
  }

  handleCwkClick(id) {
    window.sessionStorage.setItem('coursework', id);
    window.location.href = '/coursework';
  }

  getCourseworks(cwks) {
    return cwks.map((value, index) => {
      return (
        <Row key={index}>
          <Col xs>
            <FlatButton style={{ cursor: "pointer" }} onClick={() => this.handleCwkClick(value.id)} label={value.id} />
          </ Col>
          <Col xs >
            <p>{value.cwk_name}</p>
          </Col>
          <Col xs>
            <p>{value.marks}</p>
          </ Col>
        </Row>
      );
    });
  }

  render() {
    return (
      <Row start="xs">
        <Col xs={2} />
        <Col xs={8} >
          <h3>Courseworks:</h3>
          <Divider />
          <Row>
            <Col xs>
              <p><b>ID</b></p>
            </ Col>
            <Col xs >
              <p><b>Name</b></p>
            </Col>
            <Col xs>
              <p><b>Available marks</b></p>
            </ Col>
          </Row>
          {this.getCourseworks(this.props.cwk)}
        </ Col>
        <Col xs={2} />
      </Row>
    );
  }
}

CwkList.propTypes = {
  cwk: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default CwkList;
