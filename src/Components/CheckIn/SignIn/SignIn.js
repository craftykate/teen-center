import React, { Component } from 'react';
import axios from '../../../utils/axios';
import utilities from '../../../utils/utilities';
import Register from '../Register/Register';

// sign in a student
class SignIn extends Component {
  state = {
    searchTerm: ''
  }

  // update state with contents of input field
  handleTermChange = (e) => {
    this.setState({ searchTerm: e.target.value })
    if (this.props.message) this.props.setMessage('');
  }

  // reset sign in input field and toggle sign in/registration form
  toggleRegister = () => {
    this.setState({ searchTerm: '' })
    this.props.toggleRegister(); // also resets any error messages
  }

  // check if ID exists in database
  validateID = (e, ID) => {
    if (e.key === 'Enter') {
      e.preventDefault(); 
      // if input isn't empty...
      if (ID) {
        utilities.getToken().then(token => {
          // get date info for database link and signing in
          const dateInfo = utilities.getDateInfo(new Date());
          // check if student id is signed in for today
          utilities.doesIDExist(token, `/logs/${dateInfo.year}${dateInfo.month}${dateInfo.day}.json`, ID).then(signedIn => {
            // student is NOT signed in
            if (!signedIn) {
              // check if student exists
              utilities.doesIDExist(token, `/students.json`, ID).then(exists => {
                // student exists in database so sign them in
                if (exists) {
                  this.sendSignInInfo(token, ID, dateInfo);
                // student doesn't exist in database
                } else {
                  this.props.setMessage("That student ID is not registered yet");
                }
              }).catch(error => console.log(error));
            // student IS signed in
            } else {
              this.props.setMessage("That student ID has already signed in today");
            }
          }).catch(error => console.log(error.message));
        }).catch(error => console.log(error.message));
      }
    }
  }

  // send relevant info up to sign them in
  sendSignInInfo = (token, ID, dateInfo) => {
    // reset search field
    this.setState({ searchTerm: '' });
    // get info on student
    axios.get(`/students/id-${ID}.json?auth=${token}`).then(studentInfo => {
      console.log(`getting /students/id-${ID}`);
      if (studentInfo.data) {
        const student = {
          id: studentInfo.data.id,
          name: studentInfo.data.name
        }
        // pass student info and date to sign in function
        this.props.signIn(student, dateInfo);
      } else {
        this.props.setMessage("Oops, try again, there was an error");
      }
    }).catch(error => console.log(error.message));
  }

  render() {
    
    let signInOrUp = null;
    if (this.props.registering) {
      // sign up form
      signInOrUp = (
        <Register
          toggleRegister={this.props.toggleRegister}
          register={this.props.register}
          message={this.props.message}
          setMessage={this.props.setMessage} />
      )
    } else {
      // sign in form
      signInOrUp = (
        <form autoComplete="off">
          <input type="text"
            name="id"
            className="inline"
            onChange={this.handleTermChange}
            onKeyPress={(e) => this.validateID(e, this.state.searchTerm)}
            placeholder="Sign in with your student ID"
            value={this.state.searchTerm} />
          <a onClick={this.toggleRegister}>(or register)</a> {/* eslint-disable-line */}
        </form>
      );
    }

    return (
      <React.Fragment>
        {signInOrUp}
      </React.Fragment>
    )
  }
};

export default SignIn;