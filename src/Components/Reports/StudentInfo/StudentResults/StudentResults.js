import React from 'react';
import StudentItem from '../StudentItem/StudentItem';

const studentResults = (props) => {
  let results = [];
  let deleteBox = null;
  for (let studentIndex in props.students) {
    if (props.letter === 'graduates') {
      deleteBox = (
        <React.Fragment>
          <label htmlFor="delete">Delete Record?</label>
          <input type="checkbox"
            checked={false}
            onChange={() => props.deleteStudent(studentIndex, props.students[studentIndex].id, props.students[studentIndex].name)} />
        </React.Fragment>
      )
    }
    results.push([
      <form id="results" key={studentIndex}>
        <label htmlFor="name">ID: {props.students[studentIndex].id}</label>
        <StudentItem
          field="name"
          content={props.students[studentIndex].name}
          updateRecord={props.updateRecord}
          id={props.students[studentIndex].id}
          index={studentIndex} />
        <label htmlFor="phone">Student Phone:</label>
        <StudentItem
          field="phone"
          content={props.students[studentIndex].phone}
          updateRecord={props.updateRecord}
          id={props.students[studentIndex].id}
          index={studentIndex} />
        <label htmlFor="school">School:</label>
        <StudentItem
          field="school"
          content={props.students[studentIndex].school}
          updateRecord={props.updateRecord}
          id={props.students[studentIndex].id}
          index={studentIndex} />
        <label htmlFor="year">Grad Year:</label>
        <StudentItem
          field="year"
          content={props.students[studentIndex].year}
          updateRecord={props.updateRecord}
          id={props.students[studentIndex].id}
          index={studentIndex} />
        <label htmlFor="parents">Parents:</label>
        <StudentItem
          field="parents"
          content={props.students[studentIndex].parents}
          updateRecord={props.updateRecord}
          id={props.students[studentIndex].id}
          index={studentIndex} />
        <label htmlFor="parentPhone">Parent Phone:</label>
        <StudentItem
          field="parentPhone"
          content={props.students[studentIndex].parentPhone}
          updateRecord={props.updateRecord}
          id={props.students[studentIndex].id}
          index={studentIndex} />
        <label htmlFor="notes">Notes:</label>
        <StudentItem
          field="notes"
          content={props.students[studentIndex].notes}
          updateRecord={props.updateRecord}
          id={props.students[studentIndex].id}
          index={studentIndex} />
        <label htmlFor="verified">Verified?</label>
        <StudentItem
          field="verified"
          content={props.students[studentIndex].verified}
          updateRecord={props.updateRecord}
          id={props.students[studentIndex].id}
          index={studentIndex} />
        {deleteBox}
      </form>
    ])
  }
  return (
    <React.Fragment>
      <p className="highlight">Press return to save changes</p>
      {results}
    </React.Fragment>
  )
};

export default studentResults;