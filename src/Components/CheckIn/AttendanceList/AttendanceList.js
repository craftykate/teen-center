import React from 'react';

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
        <a onClick={() => props.signOut(ID)}>sign out</a>)
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
        {props.currentStudents.length > 0 ? 
          props.currentStudents.map(student => {
            if (student !== null) {
              return (
                <tr key={student.id}>
                  <td>{student.name}</td>
                  <td>{convertTime(student.timeIn)}</td>
                  <td>{convertTime(student.timeOut, student.id)}</td>
                </tr>
              )
            }
          })
        : <tr>
            <td colSpan="3">No students yet</td>
          </tr>}
      </tbody>
    </table>
  )
};

export default attendanceList;