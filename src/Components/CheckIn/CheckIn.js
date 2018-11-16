import React, {Component} from 'react';
import SignIn from './SignIn/SignIn';
import axios from '../../utils/axios-signin';

class CheckIn extends Component {

  registerStudent = (studentInfo) => {
    axios.post('/students.json', studentInfo)
      .then(response => console.log(response))
      .catch(error => console.log(error));
  }

  render() {
    return (
      <SignIn 
        register={this.registerStudent}/>
    )
  }
};

export default CheckIn;