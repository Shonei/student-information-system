import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { shallow, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

describe('Test the App component', () => {
  it('should render components', () => {
    const wrapper = shallow(<App />);
    expect(wrapper.find('NavBar').length).toEqual(1);
    expect(wrapper.find('div').length).toEqual(0);
    expect(wrapper.find('Route').length).toEqual(0);
  });
});
