import React, {Component} from 'react';
import axios from '../../utils/axios';
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
    this.refreshStudentList();
  }

  // toggle whether registration form is visible
  toggleRegister = () => {
    this.setState({ registering: !this.state.registering })
    if (this.props.message) this.props.setMessage('');
  }

  // upload student info to database
  registerStudent = (studentInfo, signInMethod) => {
    // hide any potential error message
    if (this.props.message) this.props.setMessage('');
    utilities.getToken().then(token => {
      // post student data to database
      axios.put(`/students/id-${studentInfo.id}.json?auth=${token}`, studentInfo).then(response => {
        // student data posted successfully
        if (response.status === 200) {
          // hide registration form
          this.setState({ registering: false });
          // sign them in, if needed
          if (signInMethod === 'regAndSignIn') {
            const student = {
              id: studentInfo.id,
              name: studentInfo.name
            };
            const dateInfo = utilities.getDateInfo(new Date());
            this.signIn(student, dateInfo);
          }
          // set success message
          let msg = signInMethod === 'regAndSignIn' ?
            `You successfully registered and signed in for today` 
            : `You successfully registered and are NOT signed in for today`;
          this.props.setMessage(msg);
          // erase message after a few seconds
          setTimeout(() => {
            this.props.setMessage('');
          }, 5000);
        // error signing in
        } else {
          this.props.setMessage('Oops, there was an error with the database, try again');
        }
      }).catch(error => console.log(error));
    })
  }

  // sign a student in for the day
  signIn = (student, dateInfo) => {
    // reset potential error message
    if (this.props.message) this.props.setMessage('');
    // add timeIn to student info object for attendance log
    student.timeIn = dateInfo.now;
    utilities.getToken().then(token => {
      // add student info to today's attendance log
      const link = `/logs/${dateInfo.year}${dateInfo.month}${dateInfo.day}/id-${student.id}.json`;
      axios.put(`${link}?auth=${token}`, student).then(response => {
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
          this.props.setMessage('Oops, there was an error signing in, try again');
        }
      }).catch(error => console.log(error));
    })

  }

  // sign student out
  signOut = (ID) => {
    const dateInfo = utilities.getDateInfo(new Date());
    utilities.getToken().then(token => {
      // check if student is logged in for the day (not old data)
      const link = `/logs/${dateInfo.year}${dateInfo.month}${dateInfo.day}.json`;
      utilities.doesIDExist(token, link, ID).then(signedIn => {
        // good data, so sign them out
        if (signedIn) {
          const link = `/logs/${dateInfo.year}${dateInfo.month}${dateInfo.day}/id-${ID}/timeOut.json`;
          axios.put(`${link}?auth=${token}`, dateInfo.now).then(response => {
            // also sign them out in state object
            if (response.status === 200) {
              const currentStudents = {...this.state.currentStudents};
              currentStudents[`id-${ID}`].timeOut = dateInfo.now;
              this.setState({ currentStudents })
            } else {
              this.props.setMessage('Oops, there was an error signing out, try again');
            }
          }).catch(error => console.log(error));
        // old data, so refresh attendance list
        } else {
          this.refreshStudentList();
          this.props.setMessage('There was a problem, here\'s a current list of students signed in');
          setTimeout(() => {
            this.props.setMessage('');
          }, 5000);
        }
      }).catch(error => console.log(error))
    }).catch(error => console.log(error))
  }

  // if accidentally signed out, sign them back in
  unSignOut = (ID) => {
    const dateInfo = utilities.getDateInfo(new Date());
    utilities.getToken().then(token => {
      // delete timeOut node
      const link = `/logs/${dateInfo.year}${dateInfo.month}${dateInfo.day}/id-${ID}/timeOut.json`;
      axios.delete(`${link}?auth=${token}`).then(response => {
        // also delete node in state
        if (response.status === 200) {
          const currentStudents = {...this.state.currentStudents};
          delete currentStudents[`id-${ID}`].timeOut;
          this.setState({ currentStudents })
        } else {
          this.props.setMessage('Oops, there was an error, try again');
        }
      }).catch(error => console.log(error));
    }).catch(error => console.log(error))
  }

  // get list of currently signed in students
  getCurrentStudents = (token) => {
    // get info about today's date
    const dateInfo = utilities.getDateInfo(new Date());
    // get signed in students
    const link = `/logs/${dateInfo.year}${dateInfo.month}${dateInfo.day}.json`;
    return axios.get(`${link}?auth=${token}`).then(currentStudents => {
      // return checked in students 
      return currentStudents.data ? currentStudents.data : {};
    }).catch(error => console.log(error.message))
  }

  // get current list of students signed in for the day
  refreshStudentList = () => {
    utilities.getToken().then(token => {
      this.getCurrentStudents(token).then(currentStudents => {
        this.setState({ currentStudents });
      }).catch(error => console.log(error));
    }).catch(error => console.log(error));
  }

  // sort list of students by name
  sortedStudents = () => {
    const students = {...this.state.currentStudents};
    // turn object of student objects into array of student objects
    let studentArray = Object.keys(students).map(key => students[key]);
    // sort array of student objects by name
    studentArray.sort((a, b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0));
    return studentArray;
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

        {/* show attendance list if not registering a new student */}
        {!this.state.registering ? 
          <AttendanceList 
            currentStudents={this.sortedStudents()}
            refreshStudentList={this.refreshStudentList} 
            signOut={this.signOut}
            unSignOut={this.unSignOut} />
        : null}
      </React.Fragment>
    )
  }
};

export default CheckIn;