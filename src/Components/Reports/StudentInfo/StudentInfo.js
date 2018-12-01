import React, {Component} from 'react';
import axios from '../../../utils/axios';
import utilities from '../../../utils/utilities';
import StudentItem from './StudentItem/StudentItem';

class StudentInfo extends Component {
  state = {
    letter: '',
    endLetter: null,
    students: {}
  }

  getStudents = (start, end) => {
    if (this.props.message) this.props.setMessage('');
    // if there aren't students already saved under that letter
    if (this.state.students[start] === undefined) {
      utilities.getToken().then(token => {
        // get students whose names start with the letters in the range
        const link = `/students.json?auth=${token}&orderBy="name"&startAt="${start}"&endAt="${end}"`;
        axios.get(link).then(studentData => {
          console.log('students');
          console.log(studentData.data);
          // save the results and the current letter
          const students = {...this.state.students}
          students[start] = studentData.data;
          this.setState({ 
            letter: start,
            endLetter: end,
            students
          })
          // if the range came up empty display error message
          if (Object.keys(studentData.data).length === 0) {
            this.props.setMessage('No matching students found');
          }
        })
      })
    // there are already saved under that letter so switch to that letter
    } else {
      this.setState({ 
        letter: start,
        endLetter: end
      })
      // check if there are matching student records
      if (Object.keys(this.state.students[start]).length === 0) {
        this.props.setMessage('No matching students found');
      }
    }
  }

  setStyle = (letter) => {
    return (letter === this.state.letter) ? 'active' : null;
  }

  updateRecord = (updatedInfo, id, field) => {
    console.log(updatedInfo)
    utilities.getToken().then(token => {
      const link = `/students/${id}/${field}`;
      axios.put(`${link}.json?auth=${token}`, JSON.stringify(updatedInfo)).then(response => {
        console.log('modifying student');
        if (response.status === 200) {
          const updatedStudents = {...this.state.students};
          updatedStudents[this.state.letter][id][field] = updatedInfo;
          this.setState({ students: updatedStudents });
          this.props.setMessage(`Update successful!`);
          setTimeout(() => {
            this.props.setMessage('');
          }, 5000);
        }
      })
    })
  }

  render() {
    let results = [];
    const students = {...this.state.students};
    const letter = this.state.letter;
    if (students[letter] !== undefined) {
      if (Object.keys(students[letter]).length > 0) {
        for (let studentKey in students[letter]) {
          results.push([
            <form id="results" key={studentKey}>
              <label htmlFor="name">ID: {students[letter][studentKey].id}</label>
              <StudentItem 
                field="name"
                content={students[letter][studentKey].name}
                updateRecord={this.updateRecord}
                studentKey={studentKey} />
              <label htmlFor="phone">Student Phone:</label>
              <StudentItem
                field="phone"
                content={students[letter][studentKey].phone}
                updateRecord={this.updateRecord}
                studentKey={studentKey} />
              <label htmlFor="school">School:</label>
              <StudentItem
                field="school"
                content={students[letter][studentKey].school}
                updateRecord={this.updateRecord}
                studentKey={studentKey} />
              <label htmlFor="year">Grad Year:</label>
              <StudentItem
                field="year"
                content={students[letter][studentKey].year}
                updateRecord={this.updateRecord}
                studentKey={studentKey} />
              <label htmlFor="parents">Parents:</label>
              <StudentItem
                field="parents"
                content={students[letter][studentKey].parents}
                updateRecord={this.updateRecord}
                studentKey={studentKey} />
              <label htmlFor="parentPhone">Parent Phone:</label>
              <StudentItem
                field="parentPhone"
                content={students[letter][studentKey].parentPhone}
                updateRecord={this.updateRecord}
                studentKey={studentKey} />
            </form>
          ])
        }
      }
    }
    
    return (
      <React.Fragment>
        <form>
          <label>First name starts with:</label>
          <ul id="alphabet">
            <li className={this.setStyle('A')} onClick={() => this.getStudents("A", "B")}>A</li>
            <li className={this.setStyle('B')} onClick={() => this.getStudents("B", "C")}>B</li>
            <li className={this.setStyle('C')} onClick={() => this.getStudents("C", "D")}>C</li>
            <li className={this.setStyle('D')} onClick={() => this.getStudents("D", "E")}>D</li>
            <li className={this.setStyle('E')} onClick={() => this.getStudents("E", "F")}>E</li>
            <li className={this.setStyle('F')} onClick={() => this.getStudents("F", "G")}>F</li>
            <li className={this.setStyle('G')} onClick={() => this.getStudents("G", "H")}>G</li>
            <li className={this.setStyle('H')} onClick={() => this.getStudents("H", "I")}>H</li>
            <li className={this.setStyle('I')} onClick={() => this.getStudents("I", "J")}>I</li>
            <li className={this.setStyle('J')} onClick={() => this.getStudents("J", "K")}>J</li>
            <li className={this.setStyle('K')} onClick={() => this.getStudents("K", "L")}>K</li>
            <li className={this.setStyle('L')} onClick={() => this.getStudents("L", "M")}>L</li>
            <li className={this.setStyle('M')} onClick={() => this.getStudents("M", "N")}>M</li>
            <li className={this.setStyle('N')} onClick={() => this.getStudents("N", "O")}>N</li>
            <li className={this.setStyle('O')} onClick={() => this.getStudents("O", "P")}>O</li>
            <li className={this.setStyle('P')} onClick={() => this.getStudents("P", "R")}>P/Q</li>
            <li className={this.setStyle('R')} onClick={() => this.getStudents("R", "S")}>R</li>
            <li className={this.setStyle('S')} onClick={() => this.getStudents("S", "T")}>S</li>
            <li className={this.setStyle('T')} onClick={() => this.getStudents("T", "U")}>T</li>
            <li className={this.setStyle('U')} onClick={() => this.getStudents("U", "X")}>U/V/W</li>
            <li className={this.setStyle('Y')} onClick={() => this.getStudents("Y", null)}>X/Y/Z</li>
          </ul>
        </form>
        {results}
      </React.Fragment>
    )
  }
}

export default StudentInfo;