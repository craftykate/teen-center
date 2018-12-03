import React, {Component} from 'react';
import axios from '../../../utils/axios';
import utilities from '../../../utils/utilities';

class PastSignIn extends Component {
  state = {
    date: '',
    id: '',
    studentKeys: [],
    addedStudents: [],
    addedStudentIDs: []
  }

  // update the correct state field with whatever has been typed in
  updateField = (e, fieldName) => {
    this.setState({ [fieldName]: e.target.value })
    if (this.props.message) this.props.setMessage('');
  }

  validateFields = (e) => {
    e.preventDefault(); 
    // if both fields are filled out
    if (this.state.date && this.state.id) {
      // if the date field is valid
      if (this.validateDate(this.state.date)) {
        utilities.getToken().then(token => {
          // if the students keys aren't saved, go get them
          if (this.state.studentKeys.length === 0) {
            axios.get(`/students.json?auth=${token}&shallow=true`).then(ids => {
              console.log('gettings ids')
              const studentKeys = Object.keys(ids.data);
              this.setState({ studentKeys });
              this.signIn(studentKeys);
            }).catch(error =>  console.log(error.message));
          } else {
            this.signIn(this.state.studentKeys);
          }
        })
      } else {
        this.props.setMessage('Date format not valid');
      }
    } else {
      this.props.setMessage('Enter both date and ID!');
    }
  }

  validateDate = (dateString) => {
    const dateArr = dateString.split('/');
    const month = parseInt(dateArr[0]);
    const day = parseInt(dateArr[1]);
    const year = parseInt(dateArr[2]);
    if (dateArr.length === 3 && 1 <= month && month <= 12 && 1 <= day && day <= 31 && typeof year === 'number' && year.toString().length === 4) {
      return true;
    } else {
      return false;
    }
  }

  signIn = (studentKeys) => {
    if (!this.state.addedStudentIDs.includes(this.state.id)) {
      if (studentKeys.includes(`id-${this.state.id}`)) {
        utilities.getToken().then(token => {
          axios.get(`/students/id-${this.state.id}.json?auth=${token}`).then(studentInfo => {
            console.log('getting student info');
            const student = {
              id: studentInfo.data.id,
              name: studentInfo.data.name
            };
            const dateLink = utilities.getDateInfo(this.state.date).link;
            const axiosLink = `/logs/${dateLink}/id-${this.state.id}.json?auth=${token}`;
            axios.put(axiosLink, student).then(response => {
              if (response.status === 200) {
                const updatedStudents = [...this.state.addedStudents];
                student.date = this.state.date;
                updatedStudents.push(student);
                const updatedstudentIDs = [this.state.addedStudentIDs];
                updatedstudentIDs.push(student.id);
                this.setState({
                  id: '',
                  addedStudents: updatedStudents,
                  addedStudentIDs: updatedstudentIDs
                })
              } else {
                this.props.setMessage('Oops, there was an error, try again');
              }
            })
          })
        })
      } else {
        this.props.setMessage('Student ID not registered');
      }
    } else {
      this.props.setMessage('You already added that student');
    }
  }

  undo = (date, id, index) => {
    if (this.props.message) this.props.setMessage('');
    utilities.getToken().then(token => {
      const dateLink = utilities.getDateInfo(date).link;
      const link = `/logs/${dateLink}/id-${id}.json`;
      axios.delete(`${link}?auth=${token}`).then(response => {
        if (response.status === 200) {
          const updatedStudents = [...this.state.addedStudents];
          updatedStudents.splice(index, 1);
          const updatedIDs = [...this.state.addedStudentIDs];
          const idIndex = updatedIDs.indexOf(`id-${id}`);
          updatedIDs.splice(idIndex, 1);
          this.setState({
            addedStudents: updatedStudents,
            addedStudentIDs: updatedIDs
          })
        } else {
          this.props.setMessage('Oops, there was an error, try again');
        }
      })
    })
  }

  render() {
    let results = null;
    if (this.state.addedStudents.length > 0) {
      let enteredStudents = this.state.addedStudents.map((student, i) => {
        return (
          <tr key={i}>
            <td>{student.date}</td>
            <td className="left">{student.name}</td>
            <td>{student.id}</td>
            <td>{<a onClick={() => this.undo(student.date, student.id, i)}>(x)</a>}</td>{/* eslint-disable-line */} 
          </tr> 
        )
      })
      enteredStudents.reverse();
      results = (
        <table id="entered-students">
          <thead>
            <tr>
              <th colSpan="4" className="heading">Entered Students</th>
            </tr>
            <tr>
              <th>Date</th>
              <th>Name</th>
              <th>ID</th>
              <th>Undo</th>
            </tr>
          </thead>
          <tbody>
            {enteredStudents}
          </tbody>
        </table>
      )
    }

    return (
      <React.Fragment>
        <form className="inline" autoComplete="off">
          <label htmlFor="date">Date:</label>
          <input type="text" autoFocus
            name="date"
            className="small inline"
            onChange={(e) => {this.updateField(e, 'date')}}
            placeholder="mm/dd/yyyy" />
          <label htmlFor="id">Enter Student ID:</label>
          <input type="text"
            name="id"
            className="small inline"
            onChange={(e) => {this.updateField(e, 'id')}}
            placeholder="Student ID"
            value={this.state.id} />
          <button onClick={this.validateFields}>Sign In Student</button>
        </form>
        {results}
      </React.Fragment>
    )
  }
}

export default PastSignIn;