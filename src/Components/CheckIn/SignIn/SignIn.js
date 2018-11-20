import React, { Component } from 'react';
import axios from '../../../utils/axios-signin';
import fire from '../../../utils/fire';
import Register from '../Register/Register';

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
    if (this.props.message) this.props.setMessage('');
  }

  // if registration form is shown reset signin input field and potential error message
  toggleRegister = () => {
    this.setState({
      searchTerm: ''
    })
    this.props.toggleRegister();
  }

  // check if ID exists in database
  validateID = (e, ID) => {
    if (e.key === 'Enter') {
      e.preventDefault();
    }
    // if "enter" key pressed and input isn't empty...
    if (e.key === 'Enter' && ID) {
      e.preventDefault();
      // get all the students to make sure id exists
      fire.auth().currentUser.getIdToken(true).then(token => {
        axios.get(`https://teen-center-sign-in.firebaseio.com/students.json?auth=${token}`)
          .then(students => {
            console.log(`getting all students ${students.data}`)
            // if there are students in the database make sure id exists
            if (students.data) {
              // turn keys of ids into an array
              const ids = Object.keys(students.data);
              // if id exists...
              if (ids.includes(`id-${ID}`)) {
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
                axios.get(`https://teen-center-sign-in.firebaseio.com/logs/${dateInfo.year}${dateInfo.month}${dateInfo.day}.json?auth=${token}`)
                  .then(currentStudents => {
                    console.log(`getting signed in students ${currentStudents.data}`)
                    // if there are students signed in
                    if (currentStudents.data) {
                      // turn keys of ids into an array
                      const ids = Object.keys(currentStudents.data);
                      // if id is unique, sign in student
                      if (!ids.includes(`id-${ID}`)) {
                        this.sendSignInInfo(students.data[`id-${ID}`], dateInfo);
                      } else {
                        this.props.setMessage("That student ID has already signed in today");
                      }
                      // no students signed in, so just sign in
                    } else {
                      this.sendSignInInfo(students.data[`id-${ID}`], dateInfo);
                    }
                  })
                  .catch(error => console.log(error))
                // id does not exist in database
              } else {
                this.props.setMessage("That student ID is not registered yet");
              }
              // no students records, so student doesn't exists
            } else {
              this.props.setMessage("That student ID is not registered yet");
            }
          })
          .catch(error => console.log(error));
      })
    }
  }

  // send relevant info up to sign them in
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
    let signInOrUp = (
      <form autoComplete="off">
        <input type="text"
          name="id"
          className="inline"
          onChange={this.handleTermChange}
          onKeyPress={(e) => this.validateID(e, this.state.searchTerm)}
          placeholder="Sign in with your student ID"
          value={this.state.searchTerm} />
        <a onClick={this.toggleRegister}>(or register)</a> {/* eslint-disable-line */}
      </form>
    );
    if (this.props.registering) {
      signInOrUp = (
        <Register
          toggleRegister={this.props.toggleRegister}
          register={this.props.register}
          setMessage={this.props.setMessage} />
      )
    }
    return (
      <React.Fragment>
        {signInOrUp}
      </React.Fragment>
    )
  }
};

export default SignIn;