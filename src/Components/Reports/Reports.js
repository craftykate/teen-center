import React, {Component} from 'react';
import DateRange from './DateRange/DateRange';
import SingleDay from './Single Day/SingleDay';
import StudentInfo from './StudentInfo/StudentInfo';
import PastSignIn from './PastSignIn/PastSignIn';
import './Reports.css';

class Reports extends Component {
  state = {
    view: 'student', // which "page" to look at
    message: '' // admin-wide place for error and success messages
  }

  // choose which page to display
  switchView = (view) => {
    this.setState({ 
      view,
      message: '' 
    })
  }

  // admin-wide error and success message
  setMessage = (message) => {
    this.setState({ message });
  }

  // determine if nav is active or not
  setStyle = (name) => {
    return (name === this.state.view) ? 'active' : null;
  }

  render() {
    // choose which "page" to view
    let content = null;
    switch (this.state.view) {
      case 'dateRange':
        content = (
          <DateRange
            message={this.state.message}
            setMessage={this.setMessage} />
        );
        break;
      case 'singleDay':
        content = (
          <SingleDay
            message={this.state.message}
            setMessage={this.setMessage} />
        );
        break;
      case 'student':
        content = (
          <StudentInfo
            message={this.state.message}
            setMessage={this.setMessage} />
        );
        break;
      case 'pastSignIn':
        content = (
          <PastSignIn
            message={this.state.message}
            setMessage={this.setMessage} />
        );
        break;
      default:
        break;
    }

    return (
      <React.Fragment>
        <nav>
          <ul>
            <li className={this.setStyle('dateRange')} onClick={() => this.switchView('dateRange')}>Date Range Report</li> {/* eslint-disable-line */}
            <li className={this.setStyle('singleDay')} onClick={() => this.switchView('singleDay')}>Single Day Report</li> {/* eslint-disable-line */}
            <li className={this.setStyle('student')} onClick={() => this.switchView('student')}>Look Up Students</li> {/* eslint-disable-line */}
            <li className={this.setStyle('pastSignIn')} onClick={() => this.switchView('pastSignIn')}>Past Sign In</li> {/* eslint-disable-line */}
          </ul>
        </nav>
        <p className="admin-message">{this.state.message}</p>
        <div id="results">
          {content}
        </div>
      </React.Fragment>
    )
  }
}

export default Reports;