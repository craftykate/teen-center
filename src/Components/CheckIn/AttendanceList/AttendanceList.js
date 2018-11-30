import React from 'react';
import utilities from '../../../utils/utilities';

// show today's students
const attendanceList = (props) => {

  // function to convert date to readable time format
  const convertTime = (stringTime, ID, inOrOut) => {
    // convert time to readable format
    if (stringTime !== undefined) {
      const time = new Date(stringTime);
      let hours = time.getHours();
      // convert hours to 12 hr format
      const suffix = hours >= 12 ? "p" : "a"; 
      hours = ((hours + 11) % 12 + 1);
      // pad minutes with a zero if it's single digit
      const minutes = ("0" + time.getMinutes()).slice(-2);
      // if it's a sign in time, display the time, if it's a signout time, include a link to undo
      if (inOrOut === 'out') {
        return <span className='hidden-link' onClick={() => props.unSignOut(ID)}>{`${hours}:${minutes}${suffix}`}</span>;
      } else {
        return <span>{`${hours}:${minutes}${suffix}`}</span>;
      }
    // time is undefined, so they haven't logged out yet, so show log out link
    } else {
      return <a onClick={() => props.signOut(ID)}>sign out</a>; /* eslint-disable-line */
    }
  }

  // display today's students if there are any
  let currentStudents = [];
  if (props.currentStudents && Object.keys(props.currentStudents).length > 0) {
    // loop through current students and push table row of data into an array
    for (let studentInfo in props.currentStudents) {
      const student = props.currentStudents[studentInfo];
      currentStudents.push(
        [<tr key={student.id}>
          <td>{student.name}</td>
          <td>{convertTime(student.timeIn, student.id, 'in')}</td>
          <td>{convertTime(student.timeOut, student.id, 'out')}</td>
        </tr>]
      )
    }
  // no students signed in
  } else {
    currentStudents = (
      <tr>
        <td colSpan="3" className="info">No students yet</td>
      </tr>
    )
  }

  const todaysDate = utilities.getDateInfo(new Date());
  const abbrMonth = todaysDate.monthName.slice(0, 3);
  let studentCount = null;
  switch (currentStudents.length) {
    case undefined:
      studentCount = '0 students';
      break;
    case 1:
      studentCount = '1 student';
      break;
    default:
      studentCount = `${currentStudents.length} students`
      break;
  }
  const todayHeading = `${todaysDate.weekdayName}, ${abbrMonth} ${todaysDate.day}`;

  return (
    <table>
      <thead>
        <tr>
          <th colSpan="3" className="heading">
            <strong>{todayHeading}</strong>  - {studentCount}
            <span className="heading-note">(<a onClick={props.refreshStudentList}>refresh</a> if you don't see your name)</span>{/* eslint-disable-line */}
          </th>
        </tr>
        <tr>
          <th>Name <span className="description">(sorted a-z)</span></th>
          <th>Time In</th>
          <th>Time Out</th>
        </tr>
      </thead>
      <tbody>
        {currentStudents}
      </tbody>
      <tfoot>
        <tr>
          <td colSpan="3">Click your sign out time to sign back in</td>
        </tr>
      </tfoot>
    </table>
  )
};

export default attendanceList;