import React, {Component} from 'react';
import fire from '../../utils/fire';
import AuthorizeForm from './AuthorizeForm/AuthorizeForm';

// log in to the site
class Authorize extends Component {
  state = {
    email: '',
    password: ''
  }

  // update state with contents of input field
  handleTermChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    })
    if (this.props.message) this.props.setMessage(''); // reset error message if there was one
  }

  // log in with form data
  login = (e, account) => {
    e.preventDefault();
    fire.auth().signInWithEmailAndPassword(this.state.email, this.state.password).then((u) => {
      this.setState({
        email: '',
        password: ''
      })
      // set which account to log in as
      this.props.setAccount(account);
    }).catch((error) => { this.props.setMessage(error.message)});
  }

  // log user out
  logout = () => {
    fire.auth().signOut();
    if (this.props.message) this.props.setMessage('');
  }

  // switch from admin to student account
  switchToStudent = () => {
    this.props.setAccount('student');
  }
  
  render() {
    // show login form or logout link depending on user login state
    let logInOut = null;
    let switchAccounts = null;
    if (this.props.user) {
      logInOut = <li><a onClick={this.logout}>log out admin</a></li> /* eslint-disable-line */
      if (this.props.account === 'admin') {
        switchAccounts = <li><a onClick={this.switchToStudent}>switch to student sign-in</a></li> /* eslint-disable-line */
      }
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
        <ul>
          {switchAccounts}
          {logInOut}
        </ul>
      </React.Fragment>
    )
  }
}

export default Authorize;