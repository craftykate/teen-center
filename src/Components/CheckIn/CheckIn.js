import React, {Component} from 'react';
import axios from '../../utils/axios';
import fire from '../../utils/fire';
import utilities from '../../utils/utilities';
import SignIn from './SignIn/SignIn';
import AttendanceList from './AttendanceList/AttendanceList';

// shows sign in field, registration form and current attendance log - student-facing stuff
class CheckIn extends Component {
  state = {
    registering: false, // whether student is registering
    currentStudents: [] // students who signed in today
  }

  // get list of today's students when component mounts
  componentWillMount() {
    utilities.getToken().then(token => {
      this.getCurrentStudents(token).then(currentStudents => {
        this.setState({ 
          currentStudents
        })
      })
    })
  }

  // get user's token to access database
  getToken = () => {
    return fire.auth().currentUser.getIdToken(true)
  }

  // toggle whether registration form is visible
  toggleRegister = () => {
    this.setState({
      registering: !this.state.registering
    })
    this.props.setMessage('')
  }

  // upload student info to database
  registerStudent = (studentInfo, signInMethod) => {
    // hide registration form
    this.setState({
      registering: false
    });
    // hide any potential error message
    this.props.setMessage('');
    // post student data to database
    utilities.getToken().then(token => {
      axios.put(`/students/id-${studentInfo.id}.json?auth=${token}`, studentInfo).then(response => {
        console.log(`registering student`);
        console.log(response);
        if (signInMethod === 'regAndSignIn') {
          const student = {
            id: studentInfo.id,
            name: studentInfo.name
          }
          const now = new Date();
          const dateInfo = {
            timeIn: now,
            year: now.getFullYear(),
            month: now.getMonth(),
            day: now.getDate()
          }
          this.signIn(student, dateInfo, true)
        }
        let msg = signInMethod === 'regAndSignIn' ? 
          `You successfully registered and signed in for today` 
          : `You successfully registered and are NOT signed in for today`;
        this.props.setMessage(msg);
        setTimeout(() => {
          this.props.setMessage('');
        }, 5000);
      }).catch(error => console.log(error));
    })
  }

  // sign a student in for the day
  signIn = (student, dateInfo) => {
    // reset potential error message
    this.props.setMessage('');
    // add student to attendance log for the day
    // add timeIn to student info object for attendance log
    student.timeIn = dateInfo.now;
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

    return axios.get(`/logs/${dateInfo.year}${dateInfo.month}${dateInfo.day}.json?auth=${token}`)
      .then(currentStudents => {
        console.log(`getting checked-in students`)
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

  sortedStudents = () => {
    const students = this.state.currentStudents
    // turn object of student objects into array of student objects
    let studentArray = Object.keys(students).map(key => students[key]);
    // sort array of student objects by name
    studentArray.sort((a, b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0));
    return studentArray
  }

  render() {
    return (
      <React.Fragment>

        {/* show the sign in form or register form */}
        <SignIn
          signIn={this.signIn}
          registering={this.state.registering}
          toggleRegister={this.toggleRegister}
          register={this.registerStudent}
          message={this.props.message}
          setMessage={this.props.setMessage} />

        {!this.state.registering ? 
          <AttendanceList 
            currentStudents={this.sortedStudents()}
            refreshStudentList={this.refreshStudentList} 
            signOut={this.signOut} />
        : null}

      </React.Fragment>
    )
  }
};

export default CheckIn;