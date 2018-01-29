import React from 'react';
import ReactDOM from 'react-dom';
import NavBar from './NavBar';
import { shallow, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { MuiThemeProvider as mui } from 'material-ui/styles/MuiThemeProvider';

configure({ adapter: new Adapter() });


describe('testing the NavBar', () => {
  it('It renders', () => {
    const wrapper = shallow(<NavBar />, { context: { mui } });
    expect(wrapper.find('Route').length).toEqual(2);
    expect(wrapper.find('AppBar').length).toEqual(1);
  });
});