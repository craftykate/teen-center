import React, {Component} from 'react';

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

  validateInfo = () => {
    if (this.state.id && this.state.name && this.state.school) {
      this.props.register(this.state);
    }
  }
  
  render() {
    return (
      <React.Fragment>
        <input type="text"
          onChange={(e) => this.updateField(e, 'id')}
          placeholder="ID"
          value={this.state.id} />
        <input type="text"
          onChange={(e) => this.updateField(e, 'name')}
          placeholder="Your Name"
          value={this.state.name} />
        <input type="text"
          onChange={(e) => this.updateField(e, 'school')}
          placeholder="Current School"
          value={this.state.school} />
        <button onClick={this.validateInfo}>Register</button>
      </React.Fragment>
    )
  }
};

export default Register;