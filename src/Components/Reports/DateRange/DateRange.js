import React, {Component} from 'react';
import axios from '../../../utils/axios';
import utilities from '../../../utils/utilities';
import DateRangeData from './DateRangeData/DateRangeData';

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
    if (this.state.from && this.state.to) {
      // turn dates from input fields into database format
      const from = utilities.getDateInfo(this.state.from).link;
      const to = utilities.getDateInfo(this.state.to).link;
      utilities.getToken().then(token => {
        // get log in data from date range
        const link = `/logs.json?auth=${token}&orderBy="$key"&startAt="${from}"&endAt="${to}"`;
        axios.get(link).then(rangeData => {
          console.log('/logs');
          if (Object.keys(rangeData.data).length === 0) this.props.setMessage('No records for that data range')
          // to store every visitor's id
          const allIDs = []; 
          // store visits by weekday to make averages
          const averages = {0:{weekNums: 0, visits: 0}, 1:{weekNums: 0, visits: 0}, 2:{weekNums: 0, visits: 0}, 3:{weekNums: 0, visits: 0}, 4:{weekNums: 0, visits: 0}, 5:{weekNums: 0, visits: 0}, 6:{weekNums: 0, visits: 0}};
          // go through each day in range
          for (let day in rangeData.data) {

            // ADD EVERY ID FOR THAT DAY
            // add all ids from this day to array to count later
            allIDs.push(...Object.keys(rangeData.data[day])); 

            // ADD NUMBER OF VISITS TO DAY OF WEEK
            // convert day string (yyyymmdd) into actual date object
            const year = day.slice(0, 4);
            const month = parseInt(day.slice(4, 6), 10) + 1;
            const date = day.slice(-2);
            // get the number of the day of the week
            const dayOfWeek = utilities.getDateInfo(`${month}/${date}/${year}`).weekdayNum;
            averages[dayOfWeek].weekNums++;
            averages[dayOfWeek].visits += Object.keys(rangeData.data[day]).length

          }
          // calculate average per day
          const calculatedAverages = {};
          for (let day in averages) {
            if (averages[day].weekNums !== 0) {
              calculatedAverages[day] = Math.round(averages[day].visits / averages[day].weekNums);
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
    } else {
      this.props.setMessage('Enter valid dates');
    }
  }

  convertDateForLink = (dateString) => {
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
      results = (
        <DateRangeData
          fromString={this.formatDate(this.state.fromString)}
          toString={this.formatDate(this.state.toString)}
          students={this.state.students}
          visits={this.state.visits}
          averages={this.state.averages} />
      )
    }

    return (
      <div id="date-range">
        <form autoComplete="off">
          <label>Start Date:</label>
          <input type="text" autoFocus
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