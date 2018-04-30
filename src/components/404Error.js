import React, { PureComponent } from 'react';
import image from './404.png';

class Error404 extends PureComponent {
  constructor(props) {
    super(props);

    this.style = {
      display: 'block',
      marginLeft: 'auto',
      marginRight: 'auto',
      width: '50%',
    };
  }

  render() {
    return (
      <div >
        <img src={image} alt="server-repair-ponies" style={this.style} />
        <p style={this.style}>Hit the home button to return.</p>
      </div>
    );
  }
}

export default Error404;