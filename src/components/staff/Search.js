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
    this.handleChange = this.handleChange.bind(this);
    this.getModule = this.getModule.bind(this);
    this.getProgramme = this.getProgramme.bind(this);
    this.handlePersonClick = this.handlePersonClick.bind(this);
  }

  componentDidMount() {
    let results = localStorage.getItem('search');
    results = JSON.parse(results);

    this.tables['students'] = results.students ? results.students : [];
    this.tables['staff'] = results.staff ? results.staff : [];
    this.tables['modules'] = results.modules ? results.modules : [];
    this.tables['programmes'] = results.programmes ? results.programmes : [];
    this.forceUpdate();
  }

  handleChange(e) {
    this.setState({ value: e });
  }

  getList(k, arr, getListItem) {
    return (
      <List
        key={k}
      >
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
      return;
    }
    localStorage.setItem(itemName, user);
    window.location.href = '/' + itemName;
  }

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

  getModule(m) {
    return (
      <ListItem
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
        onChange={this.handleChange}>
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
