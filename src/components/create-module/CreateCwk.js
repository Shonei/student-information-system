import React, { PureComponent } from 'react';
import { Row, Col } from 'react-flexbox-grid';
import { TextField, Divider } from 'material-ui';

class CreateCwk extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      index: 0
    };
  }

  componentDidMount() {
    console.log(this.props);
    this.setState({ index: this.props.index });
  }

  render() {
    return (
      <div>
        <Row center="xs">
          <Col xs={2} />
          <Col xs>
            <TextField
              hintText="Id"
              onChange={(e, v) => {
                this.props.onIdChange(this.state.index, v);
              }}
              type={"number"}
              style={{ width: '100%' }}
            />
          </Col>
          <Col xs>
            <TextField
              hintText="Name"
              onChange={(e, v) => {
                this.props.onNameChange(this.state.index, v);
              }}
              type={"text"}
              style={{ width: '100%' }}
            />
          </Col>
          <Col xs>
            <TextField
              hintText="Posted on"
              onChange={(e, v) => {
                this.props.onPostedOnChange(this.state.index, v);
              }}
              type={"date"}
              style={{ width: '100%' }}
            />
          </Col>
          <Col xs>
            <TextField
              hintText="Deadline"
              onChange={(e, v) => {
                this.props.onDeadlineChange(this.state.index, v);
              }}
              type={"date"}
              style={{ width: '100%' }}
            />
          </Col>
          <Col xs={2} />
        </Row>
        <br />
        <Row center="xs">
          <Col xs={2} />
          <Col xs>
            <TextField
              hintText="%"
              onChange={(e, v) => {
                this.props.onPercentageChange(this.state.index, v);
              }}
              type={"number"}
              style={{ width: '100%' }}
            />
          </Col>
          <Col xs>
            <TextField
              hintText="Marks"
              onChange={(e, v) => {
                this.props.onMarksChange(this.state.index, v);
              }}
              type={"number"}
              style={{ width: '100%' }}
            />
          </Col>
          <Col xs />
          <Col xs />
          <Col xs={2} />
        </Row>
        <br />
        <Row center="xs">
          <Col xs={2} />
          <Col xs>
            <TextField
              hintText="Description"
              onChange={(e, v) => {
                this.props.onDescriptionChange(this.state.index, v);
              }}
              multiLine={true}
              rows={1}
              type={"text"}
              fullWidth
            />
          </Col>
          <Col xs={2} />
        </Row>
        <br />
        <Divider></Divider>
        <br />
      </div>
    );
  }
}

export default CreateCwk;
