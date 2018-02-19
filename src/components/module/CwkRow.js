import React, { PureComponent } from 'react';
import { Row, Col } from 'react-flexbox-grid';
import { FlatButton, TextField } from 'material-ui';
import PropTypes from 'prop-types';

class CwkRow extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      marks: null,
      percentage: null
    };

    this.getValue = this.getValue.bind(this);
    this.handleCwkClick = this.handleCwkClick.bind(this);
    this.handleMarksChange = this.handleMarksChange.bind(this);
    this.handlePercentChange = this.handlePercentChange.bind(this);
  }

  componentDidMount() {
    this.setState({ marks: this.props.cwk.marks });
    this.setState({ percentage: this.props.cwk.percentage });
  }

  handleCwkClick(id) {
    window.sessionStorage.setItem('coursework', id);
    window.location.href = '/coursework';
  }

  handleMarksChange(event, value) {
    this.setState({ marks: value });
    this.props.onChange(this.props.cwk.id, value, this.state.percentage);
  }

  handlePercentChange(event, value) {
    this.setState({ percentage: value });
    this.props.onChange(this.props.cwk.id, this.state.marks, value);
  }

  getValue(value, hint, func) {
    if (this.props.editing) {
      return <TextField
        style={{ maxWidth: '60px' }}
        hintText={hint}
        onChange={func}
        defaultValue={value}
        type={'number'} />;
    } else {
      return <p>{value}</p>;
    }
  }

  render() {
    return (
      <Row>
        <Col xs>
          <FlatButton
            style={{ cursor: "pointer" }}
            onClick={() => this.handleCwkClick(this.props.cwk.id)}
            label={this.props.cwk.id} />
        </ Col>
        <Col xs >
          <p>{this.props.cwk.cwk_name}</p>
        </Col>
        <Col xs>
          {this.getValue(this.state.marks, "marks", this.handleMarksChange)}
        </ Col>
        <Col xs>
          {this.getValue(this.state.percentage, "%", this.handlePercentChange)}
        </ Col>
      </Row>
    );
  }
}

CwkRow.propTypes = {
  cwk: PropTypes.object.isRequired,
  editing: PropTypes.bool.isRequired
};

export default CwkRow;
