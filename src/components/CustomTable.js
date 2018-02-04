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

    this.handleClick = this.handleClick.bind(this);
    this.getHeader = this.getHeader.bind(this);
    this.getBody = this.getBody.bind(this);

    // MUST HAVE and headers
  }

  handleClick(e, f) {
    console.log(e, f);
  }

  getHeader(arr) {
    return (
      < TableRow >
        {arr.map(e => <TableHeaderColumn key={e}>{e}</TableHeaderColumn>)}
      </TableRow >);
  }

  getBody(order, values) {
    let arr = [];

    if (!values || !order) {
      return;
    }

    if (values.lenght < 1 || order.lenght < 1) {
      return;
    }

    values.forEach((value, i) => {
      let temp = order.map(e => <TableRowColumn key={Math.random()}>{String(value[e])}</TableRowColumn>);
      arr.push(<TableRow hoverable={true} key={i}>{temp}</TableRow>);
    });

    return arr;
  }

  render() {
    return (
      <Table onCellClick={this.handleClick}>
        <TableHeader>
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
  headers: PropTypes.arrayOf(PropTypes.string).isRequired,
  order: PropTypes.arrayOf(PropTypes.string),
};

export default CustomTable;
