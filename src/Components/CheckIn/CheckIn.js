import React, {Component} from 'react';
import SignIn from './SignIn/SignIn';
import Register from './Register/Register';
import AttendanceList from './AttendanceList/AttendanceList';
import axios from '../../utils/axios-signin';

// shows sign in field, registration form and current attendance log
class CheckIn extends Component {
  state = {
    registering: false, // whether student is registering

    currentStudents: []
  }

  // get list of today's students when component mounts
  componentWillMount() {
    this.getCurrentStudents();
  }

  // toggle wether registration form is visible
  toggleRegister = () => {
    const currentState = this.state.registering;
    this.setState({
      registering: !currentState
    })
  }

  // upload student info to database
  registerStudent = (studentInfo) => {
    // hide registration form
    this.setState({
      registering: false
    })

    // post student data to database
    axios.put(`/students/${studentInfo.id}.json`, studentInfo)
      .then(response => console.log(response))
      .catch(error => console.log(error));
  }

  signIn = (student, dateInfo) => {
    // hide registration form if needed
    this.setState({
      registering: false
    })

    // add student to attendance log for the day
    // add timeIn to student info object for attendance log
    student.timeIn = dateInfo.timeIn;
    // add student info to today's attendance log
    axios.put(`/logs/${dateInfo.year}/${dateInfo.month}/${dateInfo.day}/${student.id}.json`, student)
      .then(response => {
        // if student successfully signed in, update state with current student
        // (since response = 200 I can update state instead of hitting database for current info)
        if (response.status === 200) {
          const currentStudents = this.state.currentStudents;
          const updatedStudents = [...currentStudents, student];
          this.setState({
            currentStudents: updatedStudents
          })
        } else {
          console.log('error signing in')
        }
      })
      .catch(error => console.log(error));
  }

  // sign student out
  signOut = (ID) => {
    const dateInfo = this.dateInfo();
    // add sign out time to database
    axios.put(`/logs/${dateInfo.year}/${dateInfo.month}/${dateInfo.day}/${ID}/timeOut.json`, dateInfo.now)
      // if student successfully signed out, update state with sign out time
      .then(response => {
        console.log(response)
        if (response.status === 200) {
          const currentStudents = this.state.currentStudents;
          currentStudents[ID].timeOut = dateInfo.now;
          this.setState({
            currentStudents: currentStudents
          })
        } else {
          console.log('error signing out')
        }
      })
      .catch(error => console.log(error))
  }

  getCurrentStudents = () => {
    // get info about today's date
    const dateInfo = this.dateInfo();
    // get signed in students
    axios.get(`https://teen-center-sign-in.firebaseio.com/logs/${dateInfo.year}/${dateInfo.month}/${dateInfo.day}.json`)
      .then(currentStudents => {
        // if there are students signed in
        if (currentStudents.data) {
          console.log(currentStudents.data)
          this.setState({
            currentStudents: currentStudents.data
          })
        } else {
          console.log('no students')
        }
      })
      .catch(error => console.log(error))
  }

  dateInfo = () => {
    const now = new Date();
    return {
      now: now,
      year: now.getFullYear(),
      month: now.getMonth(),
      day: now.getDate()
    }
  }

  render() {
    return (
      <React.Fragment>
        {/* show sign in form if not registering a student */}
        {!this.state.registering ? 
          <SignIn 
            signIn={this.signIn} />
        // don't show anything if registering
        : null}

        {/* show the register form if register link clicked */}
        {this.state.registering ? 
          <Register
            toggleRegister={this.toggleRegister}
            register={this.registerStudent}/>
          // show the register link instead of register form
          : <a onClick={this.toggleRegister}>(or register)</a>}

        <AttendanceList 
          currentStudents={this.state.currentStudents} 
          signOut={this.signOut} />

      </React.Fragment>
    )
  }
};

export default CheckIn;