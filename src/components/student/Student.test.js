import React from 'react';
import ReactDOM from 'react-dom';
import Student from './Student';
import { shallow, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { MuiThemeProvider as mui } from 'material-ui/styles/MuiThemeProvider';

configure({ adapter: new Adapter() });

window.sessionStorage = {
  getItem: jest.fn(cb => 'shgsg')
};

describe('testing the Student', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallow(<Student />, { context: { mui } });
  });

  it('It renders', () => {
    expect(wrapper.find('Col').length).toEqual(2);
    expect(wrapper.find('Row').length).toEqual(1);
    expect(wrapper.find('Avatar').length).toEqual(1);
  });

  it('Displaes the data', () => {
    const state = {
      first_name: 'first',
      middle_name: 'middle',
      last_name: 'last',
      email: 'email',
      entry_year: 'year',
      current_level: 'level',
      id: 'id'
    };

    wrapper.setState(() => state);

    expect(wrapper.find('p').length).toEqual(7);
    expect(wrapper.find('p').first().text()).toEqual('ID: id');
    expect(wrapper.find('p').last().text()).toEqual('Current level: level');
  });
});