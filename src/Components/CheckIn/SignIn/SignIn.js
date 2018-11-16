import React, {Component} from 'react';
import Register from '../Register/Register';

class SignIn extends Component {
  render() {
    return (
      <Register 
        register={this.props.register} />
    )
  }
};

export default SignIn;