import React, { Component } from 'react';
import axios from '../../../utils/axios';
import utilities from '../../../utils/utilities';

class SingleDay extends Component {
  state = {
    searchTerm: '',
    dateString: '',
    students: {}
  }

  // update state with contents of input field
  handleTermChange = (e) => {
    this.setState({ searchTerm: e.target.value })
    if (this.props.message) this.props.setMessage('');
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


  getDayInfo = (e) => {
    e.preventDefault(); 
    if (this.state.searchTerm) {
      if (this.props.message) this.props.setMessage('');
      const date = utilities.getDateInfo(this.state.searchTerm);
      utilities.getToken().then(token => {
        axios.get(`/logs/${date.link}.json?auth=${token}`).then(students => {
          console.log('/logs');
          // convert search term to readable date
          const dateString = `${date.weekdayName.slice(0,3)}, ${date.monthName.slice(0,3)} ${date.day} ${date.year}`
          this.setState({ 
            students: students.data,
            dateString
          })
          if (students.data === null) this.props.setMessage('No records for that date');
        })
      })
    } else {
      this.props.setMessage('Enter a valid date');
    }
  }

  render() {
    let studentList = [];
    let students = this.state.students;
    if (students && Object.keys(students).length > 0) {
      studentList = []; 
      let studentArray = Object.keys(students).map(key => students[key]);
      studentArray.sort((a, b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0));
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