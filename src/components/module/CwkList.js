import React, { PureComponent } from 'react';
import { Row, Col } from 'react-flexbox-grid';
import { Divider, FlatButton, TextField } from 'material-ui';
import PropTypes from 'prop-types';
import CwkRow from './CwkRow';

class CwkList extends PureComponent {
  constructor(props) {
    super(props);

    this.getCourseworks = this.getCourseworks.bind(this);
  }

  getCourseworks(cwks) {
    return cwks.map((value, index) => {
      return <CwkRow
      key={index} 
      editing={this.props.editing}
      cwk={value}
      onChange={this.props.onChange}/>;
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
            <Col xs>
              <p><b>%</b></p>
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
  editing: PropTypes.bool.isRequired
};

export default CwkList;
