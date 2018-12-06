import React, {Component} from 'react';
import axios from '../../../utils/axios';
import utilities from '../../../utils/utilities';
import Alphabet from './Alphabet/Alphabet';
import StudentResults from './StudentResults/StudentResults';

class StudentInfo extends Component {
  state = {
    letter: '',
    students: [],
    numUnverified: null
  }

  getStudentsByLetter = (start, end) => {
    utilities.getToken().then(token => {
      const link = `/students.json?auth=${token}&orderBy="name"&startAt="${start}"&endAt="${end}\uf8ff"`
      this.fetchStudents(start, link);
    }).catch(error => console.log(error.message));
  }

  getOldStudents = () => {
    utilities.getToken().then(token => {
      const year = utilities.getDateInfo(new Date()).year - 1;
      const link = `/students.json?auth=${token}&orderBy="year"&endAt="${year}"`;
      this.fetchStudents('graduates', link);
    }).catch(error => console.log(error.message));
  }

  getUnverifiedStudents = () => {
    utilities.getToken().then(token => {
      const link = `/students.json?auth=${token}&orderBy="verified"&equalTo=null`;
      this.fetchStudents('unverified', link);
    }).catch(error => console.log(error.message));
  }

  fetchStudents = (letter, link) => {
    if (this.props.message) this.props.setMessage('');
    let students = [];
    this.setState({
      letter,
      students
    })
    axios.get(link).then(studentData => {
      console.log('getting students by letter');
      // if students were found...
      if (Object.keys(studentData.data).length > 0) {
        // push all students from object into an array
        for (let studentKey in studentData.data) {
          students.push(studentData.data[studentKey]);
        }
        // sort the array
        students.sort((a, b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0));
        // no students found
      } else {
        this.props.setMessage('No matching students found');
      }
      // set number of unverified students if on unverified tab
      if (this.state.letter === 'unverified') {
        this.setState({ numUnverified: students.length })
      }
      // add the student array to state
      this.setState({ students });
    }).catch(error => console.log(error.message));
  }

  updateRecord = (updatedInfo, id, field, index) => {
    utilities.getToken().then(token => {
      const link = `/students/id-${id}/${field}`;
      // if unverifying a student's info
      if (field === 'verified' && updatedInfo === false) {
        // delete the verified field in database
        axios.delete(`${link}.json?auth=${token}`).then(response => {
          console.log('unverifying student');
          if (response.status === 200) {
            let updatedStudents = [...this.state.students];
            updatedStudents[index][field] = updatedInfo;
            this.setState({ students: updatedStudents });
            this.props.setMessage(`Update successful!`);
            setTimeout(() => {
              this.props.setMessage('');
            }, 5000);
          } else {
            this.props.setMessage('Oops, there was an error, please try again');
          }
        }).catch(error => console.log(error.message));
      // anything besides unverifying student
      } else {
        axios.put(`${link}.json?auth=${token}`, JSON.stringify(updatedInfo)).then(response => {
          console.log('modifying student');
          if (response.status === 200) {
            let updatedStudents = [...this.state.students];
            updatedStudents[index][field] = updatedInfo;
            this.setState({ students: updatedStudents });
            this.props.setMessage(`Update successful!`);
            setTimeout(() => {
              this.props.setMessage('');
            }, 5000);
          } else {
            this.props.setMessage('Oops, there was an error, please try again');
          }
        }).catch(error => console.log(error.message));
      }
    }).catch(error => console.log(error.message));
    if (field === 'verified' && this.state.numUnverified !== null) {
      let prevNum = this.state.numUnverified;
      if (updatedInfo === true) {
        let newNum = prevNum - 1;
        this.setState({ numUnverified: newNum })
      } else {
        let newNum = prevNum + 1;
        this.setState({ numUnverified: newNum })
      }
    }
  }

  deleteStudent = (index, id, name) => {
    let delStudent = window.confirm(`Are you sure you want to delete ${name}?`);
    if (delStudent) {
      utilities.getToken().then(token => {
        const link = `/students/id-${id}`;
        axios.delete(`${link}.json?auth=${token}`).then(response => {
          if (response.status === 200) {
            let updatedStudents = [...this.state.students];
            // reduce unverified number if student was not verified and unverified number is being displayed
            let num = this.state.numUnverified;
            if (!this.state.students[index]['verified'] && this.state.numUnverified) num--;
            this.setState({ students: [] })
            updatedStudents.splice(index, 1);
            this.setState({ 
              students: updatedStudents,
              numUnverified: num 
            });
            axios.put(`/graduates/id-${id}.json?auth=${token}`, true).catch(error => console.log(error.message))
          }
        })
      })
    }
  }

  // set the style of the alphabet menu letters. Set the wide buttons with the appropriate style and the clicked button as active
  setStyle = (letter) => {
    if (letter === 'graduates') {
      return (this.state.letter === 'graduates') ? 'active graduates' : 'graduates';
    } else if (letter === 'unverified') {
      return (this.state.letter === 'unverified') ? 'acitve unverified' : 'unverified';
    } else {
      return (letter === this.state.letter) ? 'active' : null;
    }
  }

  render() {
    // display the students if any were found
    let results = null;
    if (this.state.students.length > 0) {
      results = (
        <StudentResults
          letter={this.state.letter}
          students={this.state.students}
          updateRecord={this.updateRecord}
          deleteStudent={this.deleteStudent} />
      )
    }

    // display instructions if graduates tab is selected
    let instructions = null;
    if (this.state.letter === 'graduates') {
      instructions = (
        <div className="instructions">
          <p>Deleting students will NOT change past attendance logs - your reports will stay accurate and complete. Deleting students is recommended to lighten the load on the database and help keep it free.</p>
          <p>Deleting students is permanent! You will be asked to confirm before it goes through. Once a student is deleted their ID can't be used again (to keep reports accurate). For this reason, you can only delete students who have graduated already. Any student whose graduation year is earlier than the current year will show up in this tab and will be eligible for deleting.</p>
        </div>
      )
    }

    return (
      <React.Fragment>
        {/* display alphabet menu */}
        <Alphabet
          setStyle={this.setStyle}
          getStudents={this.getStudentsByLetter}
          getOldStudents={this.getOldStudents}
          getUnverifiedStudents={this.getUnverifiedStudents}
          numUnverified={this.state.numUnverified} />
        {instructions}
        {results}
      </React.Fragment>
    )
  }
}

export default StudentInfo;