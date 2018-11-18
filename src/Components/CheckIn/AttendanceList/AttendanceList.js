import React from 'react';

// show today's students
const attendanceList = (props) => {

  // function to convert date to readable time format
  const convertTime = (stringTime, ID) => {
    // convert time to readable format
    if (stringTime !== undefined) {
      const time = new Date(stringTime);
      const hours = time.getHours();
      // pad minutes with a zero if it's single digit
      const minutes = ("0" + time.getMinutes()).slice(-2);
      return `${hours}:${minutes}`
    // time is undefined, so they haven't logged out yet, so show log out link
    } else {
      return (
        /* eslint-disable-next-line */
        <a onClick={() => props.signOut(ID)}>sign out</a>)
    }
  }

  // show no students message if no students have signed in yet
  let currentStudents = (
    <tr>
      <td colSpan="3">No students yet</td>
    </tr>
  )

  // display today's students if there are any
  if (props.currentStudents && Object.keys(props.currentStudents).length > 0) {
    currentStudents = [];
    for (const studentInfo in props.currentStudents) {
      const student = props.currentStudents[studentInfo];
      currentStudents.push(
        [<tr key={student.id}>
          <td>{student.name}</td>
          <td>{convertTime(student.timeIn)}</td>
          <td>{convertTime(student.timeOut, student.id)}</td>
        </tr>]
      )
    }
  }

  return (
    <table>
      <thead>
        <tr>
          <th colSpan="3">Today's Attendance</th>
        </tr>
        <tr>
          <th>Name</th>
          <th>Time In</th>
          <th>Time Out</th>
        </tr>
      </thead>
      <tbody>
        {currentStudents}
      </tbody>
    </table>
  )
};

export default attendanceList;