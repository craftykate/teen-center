import React, {Component} from 'react';
import axios from '../../../utils/axios';
import utilities from '../../../utils/utilities';
import Alphabet from './Alphabet/Alphabet';
import Student from './Student/Student';

// look up students
class StudentInfo extends Component {
  state = {
    letter: '', // letter or button clicked
    students: [], // students found in that letter/category
    numUnverified: null, // how many students have unverified info
    perPage: 10, // number of student records per page
    onPage: 0 // current page viewed, starts with 0
  }

  // get students matching letter clicked
  getStudentsByLetter = (start, end) => {
    utilities.getToken().then(token => {
      const link = `/students.json?auth=${token}&orderBy="name"&startAt="${start}"&endAt="${end}\uf8ff"`
      this.fetchStudents(start, link);
    }).catch(error => console.log(error.message));
  }

  // get students who graduate before current year
  getOldStudents = () => {
    utilities.getToken().then(token => {
      const year = utilities.getDateInfo(new Date()).year - 1;
      const link = `/students.json?auth=${token}&orderBy="year"&endAt="${year}"`;
      this.fetchStudents('graduates', link);
    }).catch(error => console.log(error.message));
  }

  // get students with unverified info
  getUnverifiedStudents = () => {
    utilities.getToken().then(token => {
      const link = `/students.json?auth=${token}&orderBy="verified"&equalTo=null`;
      this.fetchStudents('unverified', link);
    }).catch(error => console.log(error.message));
  }

  // get students with specified link
  fetchStudents = (letter, link) => {
    if (this.props.message) this.props.setMessage('');
    let students = [];
    // reset state info first so active state on button is immediate (otherwise there's a slight delay - and old student info will be displayed)
    this.setState({
      letter,
      students,
      onPage: 0
    })
    // get students at link given
    axios.get(link).then(studentData => {
      // if students were found...
      if (Object.keys(studentData.data).length > 0) {
        // push all students from object into an array for sorting
        for (let studentKey in studentData.data) {
          students.push(studentData.data[studentKey]);
        }
        // sort the array alphabetically by name
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

  // update student info if field has been modified
  updateRecord = (updatedInfo, id, field, index) => {
    utilities.getToken().then(token => {
      const link = `/students/id-${id}/${field}`;
      // if unverifying a student's info
      if (field === 'verified' && updatedInfo === false) {
        // delete the verified field in database - making it false messes up other things
        axios.delete(`${link}.json?auth=${token}`).then(response => {
          // unverify in state if successful, or show error message
          this.updateState(response.status, index, field, updatedInfo);
        }).catch(error => console.log(error.message));
      // anything besides unverifying student
      } else {
        // add the updated info to the link given
        axios.put(`${link}.json?auth=${token}`, JSON.stringify(updatedInfo)).then(response => {
          // update field in state if successful, or show error message
          this.updateState(response.status, index, field, updatedInfo);
        }).catch(error => console.log(error.message));
      }
    }).catch(error => console.log(error.message));
    // in unverified number has already been calculated and a verified state was altered, update unverified number
    if (field === 'verified' && this.state.numUnverified !== null) {
      let prevNum = this.state.numUnverified;
      // if student was just verified, subtract one from unverified number
      if (updatedInfo === true) {
        let newNum = prevNum - 1;
        this.setState({ numUnverified: newNum })
      // if student was just unverified, add one to unverified number
      } else {
        let newNum = prevNum + 1;
        this.setState({ numUnverified: newNum })
      }
    }
  }

  // if modifying on database was successful, update correct field in state with updated info, otherwise show error message
  updateState = (responseStatus, index, field, updatedInfo) => {
    if (responseStatus === 200) {
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
  }

  // delete student - delete box shows up on graduated students category
  deleteStudent = (index, id, name) => {
    // ask for confirmation when deleting
    let delStudent = window.confirm(`Are you sure you want to delete ${name}?`);
    if (delStudent) {
      utilities.getToken().then(token => {
        // delete student from database
        const link = `/students/id-${id}`;
        axios.delete(`${link}.json?auth=${token}`).then(response => {
          if (response.status === 200) {
            let updatedStudents = [...this.state.students];
            // reduce unverified number if student was not verified and unverified number is being displayed
            let num = this.state.numUnverified;
            if (!this.state.students[index]['verified'] && this.state.numUnverified) num--;
            // reset students in state to be blank for a second or there's a lag and old info will be displayed next
            this.setState({ students: [] })
            // remove student and update state
            updatedStudents.splice(index, 1);
            this.setState({ 
              students: updatedStudents,
              numUnverified: num 
            });
            // add student's id to graduated students so id can't be used again (to keep data correct)
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

  // change page on paginated student results and jump to top of page
  changePage = (jumpTo) => {
    window.scrollTo(0, 0);
    this.setState({ onPage: jumpTo })
  }

  render() {
    let allResults = [];
    let results = null;
    let pageLinks = null;

    // if students have been found...
    if (this.state.students.length > 0) {
      // display Student component for each student found
      for (let studentIndex in this.state.students) {
        allResults.push([
          <Student
            key={studentIndex}
            index={studentIndex}
            letter={this.state.letter}
            student={this.state.students[studentIndex]}
            updateRecord={this.updateRecord}
            deleteStudent={this.deleteStudent} />
        ])
      }

      // calculated number of pages and display page number if needed
      // total pages for letter/category
      const totalNumPages = Math.ceil(allResults.length / this.state.perPage);
      // get only the students for the current page
      results = allResults.slice(this.state.onPage * this.state.perPage, (this.state.onPage + 1) * this.state.perPage);
      // if there is more than one page needed...
      if (totalNumPages > 1) {
        let links = [];
        // number of students in category
        const totalStudents = this.state.students.length;
        // starts out as total number of students
        let finalNum = totalStudents;
        // for each page needed
        for (let i = 0; i < totalNumPages; i++) {
          // set style as active if user is on that page
          let style = (this.state.onPage === i) ? 'active' : null;
          // page numbers say [10-20] for the 10th to 20th student. If there aren't as many students as the second number, make second number equal to total number of students (so, [10-16] if there are only 16 students), otherwise leave it
          finalNum = ((i + 1) * this.state.perPage > totalStudents) ? totalStudents : (i + 1) * this.state.perPage;
          // if the first number of the page results is equal to the total number of students, don't display the second number, otherwise display '-finalNum' for the second half of the page results (for instance, this will show either [11] or [11-20])
          let secondHalf = ((i * this.state.perPage) + 1 === finalNum) ? null : `-${finalNum}`;
          // put it all together to make the whole page link
          links.push(
            <li className={style} key={i} onClick={() => this.changePage(i)}>[{(i * this.state.perPage) + 1}{secondHalf}]</li>
          );
        }
        // total row of page links
        pageLinks = (
          <div className="paginate">
            <span>Results </span>
            <ul>
              {links}
            </ul>
          </div>
        )
      }
    }

    // display instructions to press enter to save if there are results shown
    let pressEnter = null;
    if (this.state.students.length > 0) { pressEnter = <p className="press-enter">Click on a field to edit, press Enter to save</p>;}

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
        {pressEnter} 
        {pageLinks} 
        {results}
        {pageLinks}
      </React.Fragment>
    )
  }
}

export default StudentInfo;