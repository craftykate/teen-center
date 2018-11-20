import React, { Component } from 'react';
import fire from '../../../utils/fire';
import axios from '../../../utils/axios';

class SingleDay extends Component {
  state = {
    searchTerm: ''
  }

  // update state with contents of input field
  handleTermChange = (e) => {
    this.setState({
      searchTerm: e.target.value
    })
  }

  getDayInfo = (e) => {
    if (e.key === 'Enter' && e.target.value) {
      const date = this.formatDate(e.target.value)
      console.log(date)
      fire.auth().currentUser.getIdToken(true).then(token => {
        axios.get(`https://teen-center-sign-in.firebaseio.com/logs/${date}.json?auth=${token}`)
        .then(dayLog => {
          console.log(dayLog.data)
        })
      })
    }
  }

  formatDate = (date) => {
    const day = new Date(date);
    const dateObj = {
      year: day.getFullYear(),
      month: day.getMonth(),
      day: day.getDate()
    }
    return `${dateObj.year}${dateObj.month}${dateObj.day}`
  }

  render() {
    return (
      <React.Fragment>
        <input type="text"
          onChange={this.handleTermChange}
          onKeyPress={this.getDayInfo}
          placeholder="mm/dd/yyyy"
          value={this.state.searchTerm} />
      </React.Fragment>
    )
  }
}

export default SingleDay;