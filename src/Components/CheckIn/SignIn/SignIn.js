import React, { Component } from 'react';
import axios from '../../../utils/axios-signin';

// sign in a student
class SignIn extends Component {
  state = {
    searchTerm: ''
  }

  // update state with contents of input field
  handleTermChange = (e) => {
    this.setState({
      searchTerm: e.target.value
    })
  }

  // check if ID exists in database
  validateID = (e, ID) => {
    // if "enter" key pressed and input isn't empty...
    if (e.key === 'Enter' && ID) {
      // get all the students to make sure id exists
      axios.get('https://teen-center-sign-in.firebaseio.com/students.json')
        .then(students => {
          // if there are students in the database make sure id exists
          if (students.data) {
            // turn keys of ids into an array
            const ids = Object.keys(students.data);
            // if id exists...
            if (ids.includes(ID)) {
              // get info on date for timeIn and attendance log
              const now = new Date();
              const dateInfo = {
                timeIn: now,
                year: now.getFullYear(),
                month: now.getMonth(),
                day: now.getDate()
              }
              // make sure student isn't signed in already
              // get signed in students
              axios.get(`https://teen-center-sign-in.firebaseio.com/logs/${dateInfo.year}/${dateInfo.month}/${dateInfo.day}.json`)
                .then(currentStudents => {
                  // if there are students signed in
                  if (currentStudents.data) {
                    // turn keys of ids into an array
                    const ids = Object.keys(currentStudents.data);
                    // if id is unique, sign in student
                    if (!ids.includes(ID)) {
                      this.sendSignInInfo(students.data[ID], dateInfo);
                    } else {
                      console.log('already signed in')
                    }
                    // no students signed in, so just sign in
                  } else {
                    this.sendSignInInfo(students.data[ID], dateInfo);
                  }
                })
                .catch(error => console.log(error))
              // id does not exist in database
            } else {
              console.log('doesnt exist')
            }
            // no students records, so student doesn't exists
          } else {
            console.log('empty')
          }
        })
        .catch(error => console.log(error));
    }
  }

  sendSignInInfo = (student, dateInfo) => {
    // reset search field
    this.setState({
      searchTerm: ''
    });
    // send along name and id of student
    const currentStudent = { ...student }
    const studentInfo = {
      id: currentStudent.id,
      name: currentStudent.name
    }
    // pass student info and date to sign in function
    this.props.signIn(studentInfo, dateInfo);
  }

  render() {
    return (
      <React.Fragment>
        <p>Sign In</p>
        <input type="text"
          onChange={this.handleTermChange}
          onKeyPress={(e) => this.validateID(e, this.state.searchTerm)}
          placeholder="Student ID"
          value={this.state.searchTerm} />
      </React.Fragment>
    )
  }
};

export default SignIn;