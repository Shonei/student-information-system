import React from 'react';
import ReactDOM from 'react-dom';
import Tables from './Tables';
import { shallow, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { MuiThemeProvider as mui } from 'material-ui/styles/MuiThemeProvider';

configure({ adapter: new Adapter() });


describe('testing the Tables', () => {
  let wrapper;
  beforeEach(() => {
    window.fetch = jest.fn(cb => Promise.reject());
    wrapper = shallow(<Tables />, { context: { mui } });
  });

  it('It renders', () => {
    expect(wrapper.find('Tabs').length).toEqual(1);
    expect(wrapper.find('Tab').length).toEqual(3);
    expect(wrapper.find('CustomTable').length).toEqual(4);

    expect(fetch.mock.calls.length).toBe(4);
  });
});