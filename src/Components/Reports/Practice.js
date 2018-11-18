import React, {Component} from 'react';
import axios from 'axios';
import fire from '../../utils/fire';

class Practice extends Component {
  state = {
    from: '2017-10-05T08:00:00.000Z',
    to: '2018-11-15T08:00:00.000Z'
  }

  calculate = () => {
    const from = this.dateInfo(this.state.from);
    const to = this.dateInfo(this.state.to);
    console.log(from);
    console.log(to);
    this.logData(from, to)
  }

  logData = (from, to) => {
    fire.auth().currentUser.getIdToken(true).then(token => {
      axios.get(`https://teen-center-sign-in.firebaseio.com/logs.json?auth=${token}&orderBy="$key"&startAt="${from}"&endAt="${to}"`)
        .then(dateRange => {
          let allIDs = [];
          for (let day in dateRange.data) {
            allIDs.push(...Object.keys(dateRange.data[day]));
          }
          const uniqueIDs = [...new Set(allIDs)];
          console.log(allIDs.length);
          console.log(uniqueIDs.length);
        })
        .catch(error => {
          console.log(error);
        })
    })
  }

  // reusable date info for signing in and out
  dateInfo = (dateString) => {
    const date = new Date(dateString);
    const dateObj = {
      year: date.getFullYear(),
      month: date.getMonth(),
      day: date.getDate()
    };
    return `${dateObj.year}${dateObj.month}${dateObj.day}`
  }

  render() {
    return (
      <p onClick={this.calculate}>practice</p>
    )
  }
}

export default Practice;