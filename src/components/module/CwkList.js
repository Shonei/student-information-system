import React, { PureComponent } from 'react';
import { Row, Col } from 'react-flexbox-grid';
import { Divider } from 'material-ui';
import PropTypes from 'prop-types';

class CwkList extends PureComponent {
  constructor(props) {
    super(props);
  }

  getCourseworks(cwks) {
    return cwks.map((value, index) => {
      return (
        <Row key={index}>
          <Col xs>
            <p>{value.id}</p>
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
