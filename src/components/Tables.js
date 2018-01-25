import React, { Component } from 'react';
import { wrapFetch as fetch } from './helpers';
import { Grid, Row, Col } from 'react-flexbox-grid';
import { Tabs, Tab } from 'material-ui';

class Tables extends Component {
  constructor() {
    super();

    this.state = {
      value: 'b'
    };

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e) {
    this.setState({value:e});
  }

  render() {
    return (
      <Grid fluid>
        <br />
        <Tabs
          value={this.state.value}
          onChange={this.handleChange}>
          <Tab label="Tab A" value="a">
            <div>
              <h2>Controllable Tab A</h2>
              <p>
                Tabs are also controllable if you want to programmatically pass them their values.
              This allows for more functionality in Tabs such as not
              having any Tab selected or assigning them different values.
            </p>
            </div>
          </Tab>
          <Tab label="Tab B" value="b">
            <div>
              <h2>Controllable Tab B</h2>
              <p>
                This is another example of a controllable tab. Remember, if you
              use controllable Tabs, you need to give all of your tabs values or else
              you wont be able to select them.
            </p>
            </div>
          </Tab>
        </Tabs>
      </Grid>
    );
  }
}

export default Tables;
