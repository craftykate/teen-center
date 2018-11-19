import React, {Component} from 'react';
import axios from '../../../utils/axios-signin';
import utilities from '../../../utils/utilities';
import RegisterForm from './RegisterForm/RegisterForm';

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
    errorMessage: ''
  }

  // update the correct state field with whatever has been typed in
  updateField = (e, fieldName) => {
    this.setState({
      [fieldName]: e.target.value
    })
  }

  // toggle state of 
  toggleCheckbox = () => {
    this.setState({ 
      agree: !this.state.agree 
    });
  }

  // validate fields then add data to database
  validateInfo = (e, signInMethod) => {
    e.preventDefault();
    // if all fields have been filled out
    if (this.state.id && this.state.name && this.state.phone && this.state.school && this.state.year && this.state.parents && this.state.parentPhone && this.state.agree) {
      // take out irrelevant fields
      const student = { ...this.state };
      delete student.errorMessage;
      delete student.agree;
      // authorize user
      utilities.getToken().then(token => {
        // get all the students to make sure id is unique
        axios.get(`/students.json?auth=${token}`).then(students => {
          console.log(`getting all students`)
          // if there are students in database make sure id is unique
          if (students.data) {
            // turn keys of ids into an array
            const ids = Object.keys(students.data);
            // if id is unique, register student
            if (!ids.includes(`id-${this.state.id}`)) {
              this.props.register(student, signInMethod);
            // id isn't unique
            } else {
              this.setState({ errorMessage: "That ID has already been registered" })
            }
          // no students yet, so just upload data
          } else {
            this.props.register(student, signInMethod);
          }
        }).catch(error => this.setState({ errorMessage: error.message })); // something happened getting data
      }).catch(error => this.setState({ errorMessage: error.message })); // something happened verifying user
    // all fields weren't filled out
    } else {
      this.setState({ errorMessage: "All fields must be filled out" })
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