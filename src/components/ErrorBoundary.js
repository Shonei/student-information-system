import React, { PureComponent } from 'react';
import serverPonies from './server-ponies.gif'

class ErrorBoundary extends PureComponent {
  constructor(props) {
    super(props);
    this.state = { hasError: false };

    this.style = {
      display: 'block',
      marginLeft: 'auto',
      marginRight: 'auto',
      width: '50%',
    };
  }
  componentDidCatch(error, info) {
    // Display fallback UI
    this.setState({ hasError: true });
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div >
          <img src={serverPonies} alt="server-repair-ponies" style={this.style}/>
          <p style={this.style}>Our team is working on fixing the issue. Please try again in a few minutes.</p>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;