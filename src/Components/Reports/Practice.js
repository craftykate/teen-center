import React, {Component} from 'react';
import axios from 'axios';
import fire from '../../utils/fire';

class Practice extends Component {
  state = {
    from: '2017-11-11T08:00:00.000Z',
    to: '2018-11-16T08:00:00.000Z'
  }

  calculate1 = () => {
    const fromDate = this.dateInfo(this.state.from);
    const toDate = this.dateInfo(this.state.to);
    let root = "logs";
    let year;
    let month;
    let day;
    let from;
    let to;
    // console.log(fromDate.year === toDate.year);
    // this.logData("2018/10", 16, 17);

    // if years are different...
    if (fromDate.year !== toDate.year) {
      from = fromDate.year;
      to = toDate.year
    } else if (fromDate.month !== toDate.month) {
      root = `logs/${fromDate.year}`;
      from = fromDate.month;
      to = toDate.month;
    } else if (fromDate.day !== toDate.day) {
      root = `logs/${fromDate.year}/${fromDate.month}`;
      from = fromDate.day;
      to = toDate.day;
    }
    this.logData(root, from, to)
  }

  calculate = () => {
    
  }

  logData = (root, from, to) => {
    fire.auth().currentUser.getIdToken(true).then(token => {
      axios.get(`https://teen-center-sign-in.firebaseio.com/${root}.json?auth=${token}&orderBy="$key"&startAt="${from}"&endAt="${to}"`)
        .then(logs => {
          console.log(logs.data)
        })
        .catch(error => {
          console.log(error)
        })
    })
  }

  // reusable date info for signing in and out
  dateInfo = (dateString) => {
    const date = new Date(dateString);
    return {
      year: date.getFullYear(),
      month: date.getMonth(),
      day: date.getDate()
    }
  }

  render() {
    return (
      <p onClick={this.calculate}>practice</p>
    )
  }
}

export default Practice;