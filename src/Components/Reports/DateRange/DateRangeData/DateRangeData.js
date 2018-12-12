import React from 'react';

// results for date range report
const dateRangeData = (props) => (
  <React.Fragment>
    <table>
      <thead>
        <tr>
          <th colSpan="2" className="heading">From <strong>{props.fromString}</strong> to <strong>{props.toString}</strong></th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td className="half">Total # Students: <span>{props.students}</span></td>
          <td>Total # Visits: <span>{props.visits}</span></td>
        </tr>
      </tbody>
    </table>
    <table className="half-size">
      <thead>
        <tr>
          <th colSpan="2">Average by Day</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Monday</td>
          <td><span>{props.averages[1]}</span></td>
        </tr>
        <tr>
          <td>Tuesday</td>
          <td><span>{props.averages[2]}</span></td>
        </tr>
        <tr>
          <td>Wednesday</td>
          <td><span>{props.averages[3]}</span></td>
        </tr>
        <tr>
          <td>Thursday</td>
          <td><span>{props.averages[4]}</span></td>
        </tr>
        <tr>
          <td>Friday</td>
          <td><span>{props.averages[5]}</span></td>
        </tr>
        <tr>
          <td>Saturday</td>
          <td><span>{props.averages[6]}</span></td>
        </tr>
        <tr>
          <td>Sunday</td>
          <td><span>{props.averages[0]}</span></td>
        </tr>
      </tbody>
    </table>
  </React.Fragment>
);

export default dateRangeData;