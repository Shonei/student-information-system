import React, { PureComponent } from 'react';
import { List, ListItem, Avatar, Tab, Tabs } from 'material-ui';
import { darkBlack } from 'material-ui/styles/colors';

class Staff extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      value: 'students',
    };

    this.tables = {
      'students': [],
      'staff': [],
      'modules': [],
      'programmes': []
    };

    this.getList = this.getList.bind(this);
    this.getPerson = this.getPerson.bind(this);
    this.getModule = this.getModule.bind(this);
    this.getProgramme = this.getProgramme.bind(this);
    this.handlePersonClick = this.handlePersonClick.bind(this);
    this.handleModuleClick = this.handleModuleClick.bind(this);
  }

  componentDidMount() {
    let results = sessionStorage.getItem('search');
    results = JSON.parse(results);

    // make sure we don't assign an undefined value because it will mess Reacts rendering
    this.tables['students'] = results.students ? results.students : [];
    this.tables['staff'] = results.staff ? results.staff : [];
    this.tables['modules'] = results.modules ? results.modules : [];
    this.tables['programmes'] = results.programmes ? results.programmes : [];

    // not very elegant but we need to rerender the component because we didn't change the state
    this.forceUpdate();
  }

  // generates a list from an array by applying the getListItem function
  getList(k, arr, getListItem) {
    return (
      <List
        key={k}>
        {arr.map(e => getListItem(e))}
      </List>
    );
  }

  handlePersonClick(user) {
    let itemName = '';
    if (this.state.value === 'students') {
      itemName = 'student';
    } else if (this.state.value === 'staff') {
      itemName = 'staff';
    } else {
      // something has went wrong 
      // better not do anything then load a page that users can't see
      return;
    }
    sessionStorage.setItem(itemName, user);
    window.location.href = '/' + itemName;
  }

  handleModuleClick(id) {
    window.sessionStorage.setItem('module', id);
    window.location.href = '/module';
  }

  // creates alist item for a person
  // It will display their name, username and id
  // On the left there will be an avatar with their first initial
  getPerson(person) {
    return (
      <ListItem
        onClick={event => {
          event.preventDefault();
          this.handlePersonClick(person.username);
        }}
        key={person.id}
        leftAvatar={<Avatar>{person.name.charAt(0)}</Avatar>}
        primaryText={person.name}
        secondaryText={<p>
          <span style={{ color: darkBlack }}>Username: {person.username}</span><br />
          ID: {person.id}</p>}
        secondaryTextLines={2}
      />
    );
  }

  // generates a list item for a programme
  // it only includes the code and UCAS code
  getProgramme(p) {
    return (
      <ListItem
        key={p.code}
        leftAvatar={<Avatar>{p.name.charAt(0)}</Avatar>}
        primaryText={p.name}
        secondaryText={<p>
          <span style={{ color: darkBlack }}>Code: {p.code}</span><br />
          UCAS code: {p.ucas_code}</p>}
        secondaryTextLines={2}
      />
    );
  }

  // generates a list item for a module
  // it includes the name and code
  getModule(m) {
    return (
      <ListItem
        onClick={event => {
          event.preventDefault();
          this.handleModuleClick(m.code);
        }}
        key={m.code}
        leftAvatar={<Avatar>{m.name.charAt(0)}</Avatar>}
        primaryText={m.name}
        secondaryText={<p>
          <span style={{ color: darkBlack }}>Code: {m.code}</span></p>}
        secondaryTextLines={1}
      />
    );
  }

  render() {
    return (
      <Tabs
        value={this.state.value}
        onChange={e => this.setState({ value: e })}>
        <Tab label="Students" value="students">
          {this.getList("students", this.tables[this.state.value], this.getPerson)}
        </Tab>
        <Tab label="Staff" value="staff">
          {this.getList("staff", this.tables[this.state.value], this.getPerson)}
        </Tab>
        <Tab label="Modules" value="modules">
          {this.getList("modules", this.tables[this.state.value], this.getModule)}
        </Tab>
        <Tab label="Programmes" value="programmes">
          {this.getList("programmes", this.tables[this.state.value], this.getProgramme)}
        </Tab>
      </Tabs>
    );
  }
}

export default Staff;
