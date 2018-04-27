import React, { PureComponent } from 'react';
import { Row, Col } from 'react-flexbox-grid';
import { RaisedButton, TextField } from 'material-ui';
import PropTypes from 'prop-types';
import { orange500 } from 'material-ui/styles/colors';

class CwkRow extends PureComponent {
  constructor(props) {
    super(props);

    this.borderStyle = {
      borderColor: orange500,
      borderWidth: '2px'
    };

    this.state = {
      marks: null,
      percentage: null
    };

    this.style = {
      color: orange500,
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
    // check for negative marks
    if (value < 0) {
      return;
    }
    this.setState({ marks: value });
    this.props.onChange(this.props.cwk.id, value, this.state.percentage);
  }

  handlePercentChange(event, value) {
    // % goes from 0 to 100
    if (value > 100 || value < 0) {
      return;
    }
    this.setState({ percentage: value });
    this.props.onChange(this.props.cwk.id, this.state.marks, value);
  }

  getValue(value, hint, func) {
    if (this.props.editing) {
      return <TextField
        id={parseInt(Math.random() * 10, 10) + ''}
        style={{ maxWidth: '100px' }}
        hintText={hint}
        onChange={func}
        value={value}
        underlineStyle={this.borderStyle}
        underlineFocusStyle={this.borderStyle}
        type={'number'} />;
    }

    return <p>{value}</p>;
  }

  render() {
    return (
      <Row>
        <Col xs>
          <RaisedButton
            style={{ cursor: "pointer" }}
            onClick={() => this.handleCwkClick(this.props.cwk.id)}
            primary={true}
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
