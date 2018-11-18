import React, {Component} from 'react';
import StudentInfo from './StudentInfo/StudentInfo';
import SingleDay from './Single Day/SingleDay';

class Reports extends Component {
  state = {
    view: '' // dateRange, singleDay or student
  }

  switchView = (view) => {
    this.setState({
      view
    })
  }

  render() {
    let content = null;
    if (this.state.view === 'student') {
      content = <StudentInfo />
    } else if (this.state.view === 'singleDay') {
      content = <SingleDay />
    }

    return (
      <React.Fragment>
        <ul>
          
          <li><a onClick={() => this.switchView('dateRange')}>Date Range</a></li> {/* eslint-disable-line */}
          <li><a onClick={() => this.switchView('singleDay')}>Single Day</a></li> {/* eslint-disable-line */}
          <li><a onClick={() => this.switchView('student')}>Student Info</a></li> {/* eslint-disable-line */}
        </ul>

        {content}
      </React.Fragment>
    )
  }
}

export default Reports;