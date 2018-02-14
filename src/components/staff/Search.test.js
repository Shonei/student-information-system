import React from 'react';
import ReactDOM from 'react-dom';
import Search from './Search';
import { shallow, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { MuiThemeProvider as mui } from 'material-ui/styles/MuiThemeProvider';

configure({ adapter: new Adapter() });

window.localStorage = {
  getItem: jest.fn(cb => '{}')
};

describe('testing the Staff', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallow(<Search />, { context: { mui } });
  });

  it('It renders', () => {
    expect(wrapper.find('Tabs').length).toEqual(1);
    expect(wrapper.find('Tab').length).toEqual(4);
  });
});