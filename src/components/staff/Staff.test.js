import React from 'react';
import ReactDOM from 'react-dom';
import Staff from './Staff';
import { shallow, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { MuiThemeProvider as mui } from 'material-ui/styles/MuiThemeProvider';

configure({ adapter: new Adapter() });

window.sessionStorage = {
  getItem: jest.fn(cb => 'shgsg')
};

describe('testing the Staff', () => {
  let wrapper;
  beforeEach(() => {
    window.fetch = jest.fn(cb => Promise.reject());
    wrapper = shallow(<Staff />, { context: { mui } });
  });

  it('It renders', () => {
    expect(wrapper.find('Grid').length).toEqual(1);
    expect(wrapper.find('Row').length).toEqual(2);
    expect(wrapper.find('CustomTable').length).toEqual(2);

    expect(fetch.mock.calls.length).toBe(3);
  });
});