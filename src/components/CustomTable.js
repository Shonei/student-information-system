import React, { PureComponent } from 'react';
import { wrapFetch as fetch } from './helpers';
import { Grid, Row, Col } from 'react-flexbox-grid';
import { Tabs, Tab } from 'material-ui';
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

    // MUST HAVE order and headers
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

    if (!values) {
      return;
    }

    if (values.lenght < 1) {
      return;
    }

    values.forEach((value, i) => {
      let temp = order.map(e => <TableRowColumn key={value[e]}>{value[e]}</TableRowColumn>);
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

export default CustomTable;
