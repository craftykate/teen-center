import React, { Component } from 'react';
import RegisterForm from './RegisterForm/RegisterForm';
import axios from '../../../utils/axios-signin';
import fire from '../../../utils/fire';

// register a new student 
class Register extends Component {
  state = {
    id: '',
    name: '',
    phone: '',
    school: '',
    year: '',
    parents: '',
    parentPhone: '',
    agree: false,
    message: ''
  }

  // update the correct state field with whatever has been typed in
  updateField = (e, fieldName) => {
    this.setState({
      [fieldName]: e.target.value
    })
  }

  toggleCheckbox = () => {
    this.setState({ 
      agree: !this.state.agree 
    });
  }

  // validate fields then add data to database
  validateInfo = (e) => {
    e.preventDefault();
    // if all fields have been filled out
    if (this.state.id && this.state.name && this.state.phone && this.state.school && this.state.year && this.state.parents && this.state.parentPhone && this.state.agree) {
      // get all the students to make sure id is unique
      fire.auth().currentUser.getIdToken(true).then(token => {
        axios.get(`https://teen-center-sign-in.firebaseio.com/students.json?auth=${token}`)
          .then(students => {
            console.log(`getting all students ${students.data}`)
            // if there are students in database make sure id is unique
            if (students.data) {
              // turn keys of ids into an array
              const ids = Object.keys(students.data);
              // if id is unique, register student
              if (!ids.includes(`id-${this.state.id}`)) {
                this.props.register(this.state);
              // id isn't unique
              } else {
                console.log('id exists')
              }
            // no students yet, so just upload data
            } else {
              this.props.register(this.state);
            }
          })
          .catch(error => console.log(error));
      })
    } else {
      console.log('error');
      this.setState({
        message: "All fields must be filled out"
      })
    }
  }

  render() {
    return (
      <RegisterForm
        toggleRegister={this.props.toggleRegister}
        state={this.state}
        updateField={this.updateField}
        toggleCheckbox={this.toggleCheckbox}
        validateInfo={this.validateInfo} />
    )
  }
};

export default Register;