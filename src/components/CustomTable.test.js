import React from 'react';
import ReactDOM from 'react-dom';
import CustomTable from './CustomTable';
import { shallow, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { MuiThemeProvider as mui } from 'material-ui/styles/MuiThemeProvider';

configure({ adapter: new Adapter() });

describe('testing the NavBar', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallow(<CustomTable
      headers={['Module code', 'Name', 'Result', 'Year']} />,
      { context: { mui } });
  });

  it('It renders', () => {
    expect(wrapper.find('Table').length).toEqual(1);
    expect(wrapper.find('TableHeader').length).toEqual(1);
    expect(wrapper.find('TableBody').length).toEqual(1);
    expect(wrapper.find('TableRow').length).toEqual(1);
    expect(wrapper.find('TableRowColumn').length).toEqual(0);
  });

  it('Generates body cirrectly', () => {
    const o = ['1', '2', '3'];
    const val = [{ '1': 1, '2': 2, '3': 3 }, { '1': 1, '2': 2, '3': 3 }];

    wrapper.setProps({ order: o, values: val });

    expect(wrapper.find('TableRow').length).toEqual(3);
    expect(wrapper.find('TableRowColumn').length).toEqual(6);
  });

  it('No order given', () => {
    const val = [{ '1': 1, '2': 2, '3': 3 }, { '1': 1, '2': 2, '3': 3 }];

    wrapper.setProps({ values: val });

    expect(wrapper.find('TableRow').length).toEqual(1);
    expect(wrapper.find('TableRowColumn').length).toEqual(0);
  });

  it('No values given', () => {
    const o = ['1', '2', '3'];

    wrapper.setProps({ order: o });

    expect(wrapper.find('TableRow').length).toEqual(1);
    expect(wrapper.find('TableRowColumn').length).toEqual(0);
  });
});