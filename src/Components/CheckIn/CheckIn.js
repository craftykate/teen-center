import React, {Component} from 'react';
import SignIn from './SignIn/SignIn';
import Register from './Register/Register';
import axios from '../../utils/axios-signin';

// shows sign in field, registration form and current attendance log
class CheckIn extends Component {
  state = {
    registering: false // whether student is registering
  }

  // toggle wether registration form is visible
  toggleRegister = () => {
    const currentState = this.state.registering;
    this.setState({
      registering: !currentState
    })
  }

  // upload student info to database
  registerStudent = (studentInfo) => {
    // hide registration form
    this.setState({
      registering: false
    })

    // post student data to database
    axios.put(`/students/${studentInfo.id}.json`, studentInfo)
      .then(response => console.log(response))
      .catch(error => console.log(error));
  }

  signIn = (ID) => {
    console.log(ID)
  }

  render() {
    return (
      <React.Fragment>
        <SignIn 
          signIn={this.signIn} />

        {/* show the register form if register link clicked */}
        {this.state.registering ? 
          <Register
            toggleRegister={this.toggleRegister}
            register={this.registerStudent}/>
          // show the register link instead of register form
          : <a onClick={this.toggleRegister}>(or register)</a>}

      </React.Fragment>
    )
  }
};

export default CheckIn;