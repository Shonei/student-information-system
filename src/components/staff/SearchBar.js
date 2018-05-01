import React, { Component } from 'react';
import { RaisedButton, TextField } from 'material-ui';
import { Grid, Row, Col } from 'react-flexbox-grid';

class SearchBar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      errorMessage: '',
      accessLevel: window.sessionStorage.getItem('access_level')
    };

    this.search = '';
    this.handleSearch = this.handleSearch.bind(this);
  }

  handleSearch(e) {
    e.preventDefault();

    // prevent empty search queries
    if (this.search.length === 0) {
      this.setState({ errorMessage: 'Can\'t search for empty values.' });
      return;
    }

    fetch('/search/' + this.search, {
      credentials: 'same-origin',
    }).then(res => {
      if (!res.ok) {
        return Promise.reject(res);
      } else {
        return res.json();
      }
    }).then(data => {
      sessionStorage.setItem('search', JSON.stringify(data));
      window.location.href = '/search';
    }).catch(err => this.setState({ errorMessage: 'No results were found.' }));
  }

  render() {
    return (
      <Grid fluid>
        <Row end="xs" around="xs">
          <Col xs={6} >
            {this.state.accessLevel === '3' ?
              <RaisedButton
                label="Create Module"
                primary={true}
                style={{ margin: 12 }}
                onClick={() => {
                  window.location.href = '\\create\\module';
                }}
              /> : <div></div>}
          </Col>
          <Col xs={6} >
            <TextField
              hintText="Search"
              style={{ maxWidth: '100%' }}
              onChange={(event, text) => this.search = text}
            />
            <RaisedButton
              label="Search"
              primary={true}
              style={{ margin: 12 }}
              onClick={this.handleSearch}
            />
          </Col>
        </Row>
        <Row end="xs">
          <Col>
            <p style={{ color: 'red' }}>{this.state.errorMessage}</p>
          </Col>
        </Row>
      </Grid>
    );
  }
}

export default SearchBar;
