import React, { Component } from 'react';
import axios from '../../../utils/axios';
import utilities from '../../../utils/utilities';

// get attendance log for a certain date
class SingleDay extends Component {
  state = {
    searchTerm: '', // date entered
    dateString: '', // so the input fields don't change the results header
    students: {} // attendance log
  }

  // update state with contents of input field
  handleTermChange = (e) => {
    this.setState({ searchTerm: e.target.value })
    if (this.props.message) this.props.setMessage('');
  }

  // get attendance log for the given date
  getDayInfo = (e) => {
    e.preventDefault(); 
    // check if date filled out
    if (this.state.searchTerm) {
      if (this.props.message) this.props.setMessage('');
      // check if date is valid
      if (utilities.validateDate(this.state.searchTerm)) {
        const date = utilities.getDateInfo(this.state.searchTerm);
        utilities.getToken().then(token => {
          // get attendance log for date searched
          axios.get(`/logs/${date.link}.json?auth=${token}`).then(students => {
            // convert search term to readable date for results header
            const dateString = `${date.weekdayName.slice(0,3)}, ${date.monthName.slice(0,3)} ${date.day} ${date.year}`
            this.setState({ 
              students: students.data,
              dateString
            })
            if (students.data === null) this.props.setMessage('No records for that date');
          })
        })
      } else {
        this.props.setMessage('Date format not valid');
      }
    } else {
      this.props.setMessage('Enter a valid date');
    }
  }

  // function to convert date to readable time format
  convertTime = (stringTime) => {
    // convert time to readable format
    if (stringTime !== undefined) {
      const time = new Date(stringTime);
      let hours = time.getHours();
      // convert hours to 12 hr format
      const suffix = hours >= 12 ? "p" : "a";
      hours = ((hours + 11) % 12 + 1);
      // pad minutes with a zero if it's single digit
      const minutes = ("0" + time.getMinutes()).slice(-2);
      return `${hours}:${minutes}${suffix}`;
      // time is undefined, so they haven't logged out yet, so show log out link
    } else {
      return 'n/a';
    }
  }

  render() {
    let studentList = [];
    let students = this.state.students;
    // check if there are students to display in attendance log
    if (students && Object.keys(students).length > 0) {
      // store student logs in object in an array
      let studentArray = Object.keys(students).map(key => students[key]);
      // sort array of students by name
      studentArray.sort((a, b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0));
      // go through each student log and store it as table data for display
      for (let studentInfo in studentArray) {
        const student = studentArray[studentInfo];
        studentList.push(
          [<tr key={student.id}>
            <td><span>{student.name}</span></td>
            <td>{this.convertTime(student.timeIn)}</td>
            <td>{this.convertTime(student.timeOut)}</td>
          </tr>]
        )
      }
    }

    let results = null;
    // show search results if there are any
    if (students && Object.keys(students).length > 0) {
      results = (
        <table>
          <thead>
            <tr>
              <th colSpan="3" className="heading">{studentList.length} students for <strong>{this.state.dateString}</strong></th>
            </tr>
            <tr>
              <th>Name <span className="description">(sorted a-z)</span></th>
              <th>Time In</th>
              <th>Time Out</th>
            </tr>
          </thead>
          <tbody>
            {studentList}
          </tbody>
        </table>
      )
    }

    return (
      <React.Fragment>
        <form autoComplete="off">
          <label htmlFor="date">Enter date:</label>
          <input type="text" autoFocus
            name="date"
            className="inline"
            onChange={this.handleTermChange}
            placeholder="mm/dd/yyyy"
            value={this.state.searchTerm} />
          <button onClick={this.getDayInfo}>Run Report</button>
        </form>
        {results}
      </React.Fragment>
    )
  }
}

export default SingleDay;