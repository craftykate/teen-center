import React, {Component} from 'react';
import fire from '../../utils/fire';
import AuthorizeForm from './AuthorizeForm/AuthorizeForm';

// log in to the site
class Authorize extends Component {
  state = {
    email: '',
    password: '',
    errorMessage: ''
  }

  // update state with contents of input field
  handleTermChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  // log in with form data
  login = (e, account) => {
    e.preventDefault();
    fire.auth().signInWithEmailAndPassword(this.state.email, this.state.password).then((u) => {
      this.setState({
        email: '',
        password: '',
        errorMessage: ''
      })
      // set which account to log in as
      this.props.setAccount(account);
    }).catch((error) => {
      this.setState({
        errorMessage: error.message
      })
    });
  }

  // log user out
  logout = () => {
    fire.auth().signOut();
  }
  
  render() {
    // show login form or logout link depending on user login state
    let logInOut = null;
    if (this.props.user) {
      logInOut = <a onClick={this.logout}>log out admin</a> /* eslint-disable-line */
    } else {
      logInOut = (
        <AuthorizeForm 
          handleTermChange={this.handleTermChange}
          state={this.state} 
          login={this.login} />
      )
    }

    return (
      <React.Fragment>
        {logInOut}
      </React.Fragment>
    )
  }
}

export default Authorize;