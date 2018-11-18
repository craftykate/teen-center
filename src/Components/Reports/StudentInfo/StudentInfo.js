import React, {Component} from 'react';
import fire from '../../../utils/fire';
import axios from '../../../utils/axios-signin';

class StudentInfo extends Component {
  state = {
    searchTerm: '',
    student: {}
  }

  // update state with contents of input field
  handleTermChange = (e) => {
    this.setState({
      searchTerm: e.target.value
    })
  }

  getStudentInfo = (e) => {
    if (e.key === 'Enter' && e.target.value) {
      const id = e.target.value;
      fire.auth().currentUser.getIdToken(true).then(token => {
        axios.get(`https://teen-center-sign-in.firebaseio.com/students/id-${id}.json?auth=${token}`)
        .then(student => {
          if (student.data) {
            this.setState({
              searchTerm: '',
              student: student.data
            })
          } else {
            console.log('no student')
            this.setState({
              searchTerm: ''
            })
          }
        })
      })
    }
  }

  render() {
    let student = null;
    if (this.state.student) {
      student = (
        <React.Fragment>
          <p>{this.state.student.id}</p>
          <p>{this.state.student.name}</p>
        </React.Fragment>
      )
    }
    return (
      <React.Fragment>
        <input type="text"
          onChange={this.handleTermChange}
          onKeyPress={this.getStudentInfo}
          placeholder="Student ID"
          value={this.state.searchTerm} />
        {student}
      </React.Fragment>
    )
  }
}

export default StudentInfo;