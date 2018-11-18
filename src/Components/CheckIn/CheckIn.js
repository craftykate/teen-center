import React, {Component} from 'react';
import SignIn from './SignIn/SignIn';
import Register from './Register/Register';
import AttendanceList from './AttendanceList/AttendanceList';
import axios from '../../utils/axios-signin';
import fire from '../../utils/fire';

// shows sign in field, registration form and current attendance log
class CheckIn extends Component {
  state = {
    registering: false, // whether student is registering
    currentStudents: [] // students who signed in today
  }

  // get list of today's students when component mounts
  componentWillMount() {
    fire.auth().currentUser.getIdToken(true).then(token => {
      this.getCurrentStudents(token)
        .then(currentStudents => {
          this.setState({
            currentStudents: currentStudents
          })
        })
    })
  }

  // get user's token to access database
  getToken = () => {
    return fire.auth().currentUser.getIdToken(true)
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
    this.getToken().then(token => {
      axios.put(`/students/id-${studentInfo.id}.json?auth=${token}`, studentInfo)
        .then(response => {
          console.log(`registering student ${response}`)
        })
        .catch(error => console.log(error));
    })
  }

  // sign a student in for the day
  signIn = (student, dateInfo) => {
    // add student to attendance log for the day
    // add timeIn to student info object for attendance log
    student.timeIn = dateInfo.timeIn;
    // add student info to today's attendance log
    this.getToken().then(token => {
      axios.put(`/logs/${dateInfo.year}${dateInfo.month}${dateInfo.day}/id-${student.id}.json?auth=${token}`, student)
        .then(response => {
          console.log(`signing in student ${response}`)
          // if student successfully signed in, update state with current student
          // (since response = 200 I can update state instead of hitting database for current info)
          if (response.status === 200) {
            const updatedStudents = {...this.state.currentStudents};
            updatedStudents[`id-${student.id}`] = student;
            this.setState({
              currentStudents: updatedStudents,
              registering: false
            })
          } else {
            console.log('error signing in')
          }
        })
        .catch(error => console.log(error));
    })

  }

  // sign student out
  signOut = (ID) => {
    const dateInfo = this.dateInfo();
    // add sign out time to database
    this.getToken().then(token => {
      axios.put(`/logs/${dateInfo.year}${dateInfo.month}${dateInfo.day}/id-${ID}/timeOut.json?auth=${token}`, dateInfo.now)
        // if student successfully signed out, update state with sign out time
        .then(response => {
          console.log(`signing out student ${response}`)
          if (response.status === 200) {
            const currentStudents = {...this.state.currentStudents};
            currentStudents[`id-${ID}`].timeOut = dateInfo.now;
            this.setState({
              currentStudents: currentStudents
            })
          } else {
            console.log('error signing out')
          }
        })
        .catch(error => console.log(error))
    })
  }

  // get list of currently signed in students
  getCurrentStudents = (token) => {
    // get info about today's date
    const dateInfo = this.dateInfo();
    // get signed in students

    return axios.get(`https://teen-center-sign-in.firebaseio.com/logs/${dateInfo.year}${dateInfo.month}${dateInfo.day}.json?auth=${token}`)
      .then(currentStudents => {
        console.log(`getting checked-in students ${currentStudents.data}`)
        // if there are students signed in
        if (currentStudents.data) {
          return currentStudents.data
        } else {
          return {}
        }
      })
      .catch(error => console.log(error))
  }

  // refresh link to refresh student list if there are multiple screens open
  refreshStudentList = () => {
    this.getToken().then(token => {
      this.getCurrentStudents(token)
      .then(currentStudents => {
        this.setState({
          currentStudents
        })
      })
    })
  }

  // reusable date info for signing in and out
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
          /* eslint-disable-next-line */
          : <a onClick={this.toggleRegister}>(or register)</a>}
        <AttendanceList 
          currentStudents={this.state.currentStudents}
          refreshStudentList={this.refreshStudentList} 
          signOut={this.signOut} />

      </React.Fragment>
    )
  }
};

export default CheckIn;