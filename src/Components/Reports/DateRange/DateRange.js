import React, {Component} from 'react';
import axios from '../../../utils/axios';
import utilities from '../../../utils/utilities';
import './DateRange.css';

class DateRange extends Component {
  state = {
    from: '',
    to: '',
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
    const from = this.convertDate(this.state.from);
    const to = this.convertDate(this.state.to);
    utilities.getToken().then(token => {
      const link = `/logs.json?auth=${token}&orderBy="$key"&startAt="${from}"&endAt="${to}"`;
      axios.get(link).then(rangeData => {
        let allIDs = [];
        let averages = {0:{},1:{},2:{},3:{},4:{},5:{},6:{}};
        for (let day in rangeData.data) {
          allIDs.push(...Object.keys(rangeData.data[day]));
          console.log(rangeData.data[day])
          for (let student in rangeData.data[day]) {
            console.log(rangeData.data[day][student])
          }
        }
        const uniqueIDs = [...new Set(allIDs)];
        this.setState({
          students: uniqueIDs.length,
          visits: allIDs.length
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
        <h2>From <span>{this.formatDate(this.state.from)}</span> to <span>{this.formatDate(this.state.to)}</span></h2>
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
                <td>20</td>
              </tr>
              <tr>
                <td>Tuesday</td>
                <td>25</td>
              </tr>
              <tr>
                <td>Wednesday</td>
                <td>30</td>
              </tr>
              <tr>
                <td>Thursday</td>
                <td>35</td>
              </tr>
              <tr>
                <td>Friday</td>
                <td>40</td>
              </tr>
              <tr>
                <td>Saturday</td>
                <td>0</td>
              </tr>
              <tr>
                <td>Sunday</td>
                <td>0</td>
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