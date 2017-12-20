import React, { Component } from 'react';
import { AppBar, FlatButton } from 'material-ui';

const styles = {
  cursor: 'pointer',
};

class NavBar extends Component {
  render() {
    return (
      <AppBar
        title={<span style={styles}>Home</span>}
        showMenuIconButton={false}
        onTitleClick={() => window.location.href = "/"}
        iconElementRight={<FlatButton label="Log in" />}>
      </AppBar>
    );
  }
}

export default NavBar;
