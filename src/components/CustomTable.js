import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';

class CustomTable extends PureComponent {
  constructor(props) {
    super(props);

    this.getHeader = this.getHeader.bind(this);
    this.getBody = this.getBody.bind(this);
  }

  // creates a table header row given an array of strings
  getHeader(arr) {
    return (
      < TableRow >
        {arr.map(e => <TableHeaderColumn key={e}>{e}</TableHeaderColumn>)}
      </TableRow >);
  }

  // given an order and values it creates an table body
  getBody(order, values) {
    let arr = [];

    // check for empty or undefined values
    if (!values || !order) {
      return;
    }

    // makes sure they are arrays 
    if (values.lenght > 1 || order.lenght > 1) {
      return;
    }

    // create the table body
    values.forEach((value, i) => {
      // create the tables body with a good enough unique key and check for empty values
      let temp = order.map(e => <TableRowColumn key={Math.random()}>{value[e] ? value[e] : ''}</TableRowColumn>);
      arr.push(<TableRow hoverable={true} key={i}>{temp}</TableRow>);
    });

    return arr;
  }

  render() {
    return (
      <Table>
        <TableHeader
          adjustForCheckbox={false}>
          {this.getHeader(this.props.headers)}
        </TableHeader>
        <TableBody displayRowCheckbox={false}>
          {this.getBody(this.props.order, this.props.values)}
        </TableBody>
      </Table>
    );
  }
}

CustomTable.propTypes = {
  // headers are needed so people can still know what info is stored in the table
  headers: PropTypes.arrayOf(PropTypes.string).isRequired,
  order: PropTypes.arrayOf(PropTypes.string),
};

export default CustomTable;
