import React, {Component} from 'react';
import axios from '../../../utils/axios';
import utilities from '../../../utils/utilities';
import DateRangeData from './DateRangeData/DateRangeData';

// get numbers of students signed in over a date range
class DateRange extends Component {
  state = {
    from: '', // date entered in field
    fromString: '', // so the input fields don't change the results header
    to: '', // date entered in field
    toString: '', // so the input fields don't change the results header
    students: 0, // how many students visited over time range
    visits: 0, // how many times all students visited over time range
    averages: {} // number of visits per day for calculating averages
  }

  // update the correct state field with whatever has been typed in
  updateField = (e, fieldName) => {
    this.setState({ [fieldName]: e.target.value })
    if (this.props.message) this.props.setMessage('');
  }

  // get number of students, number of visits and calculate averages over date range entered
  getDateRangeData = (e) => {
    e.preventDefault(); 
    // check if both date fields entered
    if (this.state.from && this.state.to) {
      // check if dates entered are valid dates
      if (utilities.validateDate(this.state.from) && utilities.validateDate(this.state.to)) {
        // turn dates from input fields into database format
        const from = utilities.getDateInfo(this.state.from).link;
        const to = utilities.getDateInfo(this.state.to).link;
        utilities.getToken().then(token => {
          // get log in data from date range
          const link = `/logs.json?auth=${token}&orderBy="$key"&startAt="${from}"&endAt="${to}"`;
          axios.get(link).then(rangeData => {
            // check if there are any results
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
        this.props.setMessage('Date format not valid');
      }
    } else {
      this.props.setMessage('Enter valid dates');
    }
  }

  // Make header dates readable
  formatDate = (dateString) => {
    const date = utilities.getDateInfo(dateString);
    const weekday = date.weekdayName.slice(0, 3);
    const month = date.monthName.slice(0, 3);
    return `${weekday}, ${month} ${date.day} ${date.year}`
  }

  render() {
    let results = null;
    // show results once searched
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
      <React.Fragment>
        <form className="inline" autoComplete="off">
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
      </React.Fragment>
    )
  }
};

export default DateRange;