import React, {Component} from 'react';
import axios from '../../../utils/axios';
import utilities from '../../../utils/utilities';

// sign students in for any date
class PastSignIn extends Component {
  state = {
    date: '', 
    id: '', // student id to add
    studentKeys: [], // all student ids saved so they don't have to be retrieved every time a student is added
    addedStudents: {}, // all students signed in this session
  }

  // update the correct state field with whatever has been typed in
  updateField = (e, fieldName) => {
    this.setState({ [fieldName]: e.target.value })
    if (this.props.message) this.props.setMessage('');
  }

  // make sure date is valid and student id is registered
  validateFields = (e) => {
    e.preventDefault(); 
    // if both fields are filled out
    if (this.state.date && this.state.id) {
      // if the date field is valid
      if (utilities.validateDate(this.state.date)) {
        utilities.getToken().then(token => {
          // if the students keys aren't saved, go get them
          if (this.state.studentKeys.length === 0) {
            axios.get(`/students.json?auth=${token}&shallow=true`).then(ids => {
              const studentKeys = Object.keys(ids.data);
              // save all student ids
              this.setState({ studentKeys });
              // send all ids to signin function to make sure id added is included
              this.signIn(studentKeys);
            }).catch(error =>  console.log(error.message));
          } else {
            this.signIn(this.state.studentKeys);
          }
        }).catch(error => console.log(error.message));
      } else {
        this.props.setMessage('Date format not valid');
      }
    } else {
      this.props.setMessage('Enter both date and ID!');
    }
  }

  // sign student in for the date in state
  signIn = (studentKeys) => {
    // make sure student id is registered
    if (studentKeys.includes(`id-${this.state.id}`)) {
      utilities.getToken().then(token => {
        // turn date in state into format for database
        const dateLink = utilities.getDateInfo(this.state.date).link;
        const allStudents = { ...this.state.addedStudents };
        const todaysStudents = { ...allStudents[dateLink] };
        // check if admin has not added that student for that day
        if (!Object.keys(todaysStudents).includes(this.state.id)) {
          // get student's info for signing in
          axios.get(`/students/id-${this.state.id}.json?auth=${token}`).then(studentInfo => {
            const student = {
              id: studentInfo.data.id,
              name: studentInfo.data.name
            }
            // sign in student on database
            const link = `/logs/${dateLink}/id-${this.state.id}.json?auth=${token}`;
            axios.put(link, student).then(response => {
              if (response.status === 200) {
                // add student to state for that date
                todaysStudents[this.state.id] = { ...student };
                allStudents[dateLink] = todaysStudents;
                this.setState({ 
                  id: '',
                  addedStudents: { ...allStudents }
                })
              } else {
                this.props.setMessage('Oops, there was an error, please try again');
              }
            }).catch(error => console.log(error.message));
          }).catch(error => console.log(error.message));
        // admin has already added that student for that day
        } else {
          this.props.setMessage('That student has already been added for that day');
        }
      })
    } else {
      this.props.setMessage('That student ID is not registered!');
    }
  }

  // undo signing a student in
  undo = (date, id) => {
    if (this.props.message) this.props.setMessage('');
    utilities.getToken().then(token => {
      // delete student from that date on database
      const link = `/logs/${date}/id-${id}.json`;
      axios.delete(`${link}?auth=${token}`).then(response => {
        // if successful, delete from state
        if (response.status === 200) {
          const updatedStudents = { ...this.state.addedStudents };
          delete updatedStudents[date][id];
          this.setState({
            id: '',
            addedStudents: updatedStudents
          })
        } else {
          this.props.setMessage('Oops, there was an error, try again');
        }
      }).catch(error => console.log(error.message));
    }).catch(error => console.log(error.message));
  }

  render() {
    let results = null;
    // if there are students signed in this session, show them
    if (Object.keys(this.state.addedStudents).length > 0) {
      const enteredStudents = [];
      // go through each date in the object
      for (const date in this.state.addedStudents) {
        // turn date link back into readable date for display
        const dateObj = utilities.getDateInfo(`${date.slice(4, 6)}/${date.slice(6, 8)}/${date.slice(0, 4)}`);
        const readableDate = `${dateObj.month}/${dateObj.day}/${dateObj.year}`;
        // push all students for that date into an array
        const studentsArray = [];
        for (const id in this.state.addedStudents[date]) {
          studentsArray.push(this.state.addedStudents[date][id])
        }
        // sort students BACKWARDS for that date by name (will be flipped again later)
        studentsArray.sort((a, b) => (a.name < b.name) ? 1 : ((b.name < a.name) ? -1 : 0));
        // go through each student in array
        for (const i in studentsArray) {
          // add table data for that student
          enteredStudents.push([
            <tr key={studentsArray[i].id}>
              <td>{readableDate}</td>
              <td className="left">{studentsArray[i].name}</td>
              <td>{studentsArray[i].id}</td>
              <td>{<a onClick={() => this.undo(date, studentsArray[i].id)}>(x)</a>}</td>{/* eslint-disable-line */}
            </tr> 
          ])
        }
      }
      // show students with most recent date at the top (will also flip students back to being alphabetized properly)
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