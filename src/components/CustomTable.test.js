import React from 'react';
import ReactDOM from 'react-dom';
import CustomTable from './CustomTable';
import { shallow, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { MuiThemeProvider as mui } from 'material-ui/styles/MuiThemeProvider';

configure({ adapter: new Adapter() });

describe('testing the NavBar', () => {
  it('It renders', () => {
    const wrapper = shallow(<CustomTable
      headers={['Module code', 'Name', 'Result', 'Year']}
      order={['code', 'name', 'result', 'study_year']} />,
      { context: { mui } });
    expect(wrapper.find('Table').length).toEqual(1);
    expect(wrapper.find('TableHeader').length).toEqual(1);
    expect(wrapper.find('TableBody').length).toEqual(1);
    expect(wrapper.find('TableRow').length).toEqual(1);
    expect(wrapper.find('TableRowColumn').length).toEqual(0);
  });
});