import React, { Component } from 'react';
import RegisterForm from './RegisterForm/RegisterForm';
import axios from '../../../utils/axios-signin';

// register a new student 
class Register extends Component {
  state = {
    id: '',
    name: '',
    school: ''
  }

  // update the correct state field with whatever has been typed in
  updateField = (e, fieldName) => {
    switch (fieldName) {
      case 'id':
        this.setState({
          id: e.target.value
        });
        break;
      case 'name':
        this.setState({
          name: e.target.value
        });
        break;
      case 'school':
        this.setState({
          school: e.target.value
        });
        break;
    }
  }

  // validate fields then add data to database
  validateInfo = () => {
    // if all fields have been filled out
    if (this.state.id && this.state.name && this.state.school) {
      // get all the students to make sure id is unique
      axios.get('https://teen-center-sign-in.firebaseio.com/students.json')
        .then(students => {
          // if there are students in database make sure id is unique
          if (students.data) {
            const ids = Object.keys(students.data);
            if (!ids.includes(this.state.id)) {
              this.props.register(this.state);
            }
          // no students yet, so just upload data
          } else {
            this.props.register(this.state);
          }
        })
        .catch(error => console.log(error));
    }
  }

  render() {
    return (
      <RegisterForm
        toggleRegister={this.props.toggleRegister}
        state={this.state}
        updateField={this.updateField}
        validateInfo={this.validateInfo} />
    )
  }
};

export default Register;