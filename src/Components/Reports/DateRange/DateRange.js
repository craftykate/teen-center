import React, {Component} from 'react';
import axios from '../../../utils/axios';
import utilities from '../../../utils/utilities';
import './DateRange.css';

class DateRange extends Component {
  state = {
    from: '',
    fromString: '', // so the input fields don't change the results header
    to: '',
    toString: '', // so the input fields don't change the results header
    students: 0,
    visits: 0,
    averages: {}
  }

  // update the correct state field with whatever has been typed in
  updateField = (e, fieldName) => {
    this.setState({ [fieldName]: e.target.value })
    if (this.props.message) this.props.setMessage('');
  }

  getDateRangeData = (e) => {
    e.preventDefault(); 
    // turn dates from input fields into database format
    const from = this.convertDate(this.state.from);
    const to = this.convertDate(this.state.to);
    utilities.getToken().then(token => {
      // get log in data from date range
      const link = `/logs.json?auth=${token}&orderBy="$key"&startAt="${from}"&endAt="${to}"`;
      axios.get(link).then(rangeData => {
        // store every visit
        const allIDs = []; 
        // store visits by weekday to make averages
        const averages = {0:{weekNums: 0, visits: 0}, 1:{weekNums: 0, visits: 0}, 2:{weekNums: 0, visits: 0}, 3:{weekNums: 0, visits: 0}, 4:{weekNums: 0, visits: 0}, 5:{weekNums: 0, visits: 0}, 6:{weekNums: 0, visits: 0}};
        for (let day in rangeData.data) {
          // add all ids from this day to array to count later
          allIDs.push(...Object.keys(rangeData.data[day])); 
          // convert day string (yyyymmdd) into actual date object
          const month = parseInt(day.slice(4, 6), 10) + 1;
          const date = `${month}/${day.slice(-2)}/${day.slice(0, 4)}`;
          // get the number of the day of the week
          const dayOfWeek = utilities.getDateInfo(date).weekdayNum;
          averages[dayOfWeek].weekNums++;
          for (let student in rangeData.data[day]) {
            averages[dayOfWeek].visits++;
          }
        }
        const calculatedAverages = {};
        for (let day in averages) {
          if (averages[day].weekNums !== 0) {
            calculatedAverages[day] = averages[day].visits / averages[day].weekNums;
          } else {
            calculatedAverages[day] = 0;
          }
        }
        // make a new array from just unique ids in order to count students
        const uniqueIDs = [...new Set(allIDs)]; 
        this.setState({
          students: uniqueIDs.length,
          visits: allIDs.length,
          fromString: this.state.from,
          toString: this.state.to,
          averages: calculatedAverages
        })
      }).catch(error => console.log(error));
    })
  }

  convertDate = (dateString) => {
    const date = utilities.getDateInfo(dateString);
    return `${date.year}${date.month}${date.day}`;
  }

  formatDate = (dateString) => {
    const date = utilities.getDateInfo(dateString);
    const weekday = date.weekdayName.slice(0, 3);
    const month = date.monthName.slice(0, 3);
    return `${weekday}, ${month} ${date.day} ${date.year}`
  }

  render() {
    let results = null;
    if (this.state.students) {
      const dateHeader = (
        <h2>From <span>{this.formatDate(this.state.fromString)}</span> to <span>{this.formatDate(this.state.toString)}</span></h2>
      );
      results = (
        <React.Fragment>
          <div id="range-results">
            {dateHeader}
            <p>Total # of Students: <span>{this.state.students}</span></p>
            <p>Total # of Visits: <span>{this.state.visits}</span></p>
          </div>

          <table>
            <thead>
              <tr>
                <th colSpan="2">Average by Day</th>
              </tr>
              <tr>
                <th>Day</th>
                <th>Students</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Monday</td>
                <td>{this.state.averages[1]}</td>
              </tr>
              <tr>
                <td>Tuesday</td>
                <td>{this.state.averages[2]}</td>
              </tr>
              <tr>
                <td>Wednesday</td>
                <td>{this.state.averages[3]}</td>
              </tr>
              <tr>
                <td>Thursday</td>
                <td>{this.state.averages[4]}</td>
              </tr>
              <tr>
                <td>Friday</td>
                <td>{this.state.averages[5]}</td>
              </tr>
              <tr>
                <td>Saturday</td>
                <td>{this.state.averages[6]}</td>
              </tr>
              <tr>
                <td>Sunday</td>
                <td>{this.state.averages[0]}</td>
              </tr>
            </tbody>
          </table>
        </React.Fragment>
      )
    }
    return (
      <div id="date-range">
        <form>
          <label>Start Date:</label>
          <input type="text"
            name="from"
            className="small inline"
            onChange={(e) => this.updateField(e, 'from')}
            placeholder="mm/dd/yyyy"
            value={this.state.from} />
          <label>End Date:</label>
          <input type="text"
            name="to"
            className="small inline"
            onChange={(e) => this.updateField(e, 'to')}
            placeholder="mm/dd/yyyy"
            value={this.state.to} />
          <button onClick={this.getDateRangeData}>Run Report</button>
        </form>
        {results}
      </div>
    )
  }
};

export default DateRange;