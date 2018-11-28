import React, {Component} from 'react';
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
    agree: false
  }

  // update the correct state field with whatever has been typed in
  updateField = (e, fieldName) => {
    this.setState({ [fieldName]: e.target.value })
    if (this.props.message) this.props.setMessage('');
  }

  // toggle state of 
  toggleCheckbox = () => {
    this.setState({ agree: !this.state.agree });
    if (this.props.message) this.props.setMessage('');
  }

  // validate fields then add data to database
  validateInfo = (e, signInMethod) => {
    e.preventDefault();
    // if all fields have been filled out
    if (this.state.id && this.state.name && this.state.phone && this.state.school && this.state.year && this.state.parents && this.state.parentPhone && this.state.agree) {
      // take out irrelevant fields
      const student = { ...this.state };
      delete student.agree;
      // capitalize first name
      const name = student.name;
      const capName = name.charAt(0).toUpperCase() + name.slice(1);
      student.name = capName;
      utilities.getToken().then(token => {
        // check if id already exists in database
        utilities.doesIDExist(token, `/students.json`, student.id).then(exists => {
          // id is NOT in database already so register student
          if (!exists) {
            this.props.register(student, signInMethod);
          // id IS in database
          } else {
            this.props.setMessage("That ID has already been registered")
          }
        }).catch(error => this.props.setMessage(error.message)); // something happened checking student ids
      }).catch(error => this.props.setMessage(error.message)); // something happened verifying user
    // all fields weren't filled out
    } else {
      this.props.setMessage("All fields must be filled out")
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