import React, { Component } from 'react';
import { wrapFetch } from './../helpers';
import { RaisedButton, TextField } from 'material-ui';
import { Grid, Row, Col } from 'react-flexbox-grid';

class SearchBar extends Component {
  constructor() {
    super();

    this.state = {
      errorMessage: ''
    };

    this.search = '';
    this.handleSearch = this.handleSearch.bind(this);
  }

  handleSearch(e) {
    e.preventDefault();
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
      localStorage.setItem('search', JSON.stringify(data));
      window.location.href = '/search';
    }).catch(err => this.setState({ errorMessage: 'No results were found.' }));
  }

  render() {
    return (
      <Grid fluid>
        <Row end="xs">
          <Col xs={6} >
            <p style={{ color: 'red' }}>{this.state.errorMessage}</p>
          </Col>
          <Col xs={5} >
            <TextField
              hintText="Search"
              onChange={(event, text) => this.search = text}
            />
            <RaisedButton
              label="Search"
              primary={true}
              style={{ margin: 12 }}
              onClick={this.handleSearch}
            />
          </Col>
          <Col xs={1} />
        </Row>
      </Grid>
    );
  }
}

export default SearchBar;
