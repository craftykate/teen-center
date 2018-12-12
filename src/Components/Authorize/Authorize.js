import React, {Component} from 'react';
import fire from '../../utils/fire';
import AuthorizeForm from './AuthorizeForm/AuthorizeForm';

// log in to the site
class Authorize extends Component {
  state = {
    email: '', // email entered
    password: '', // password entered
    pwdReset: false // show or don't show password reset fields
  }

  // update state with contents of input field
  handleTermChange = (e) => {
    this.setState({ [e.target.name]: e.target.value })
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
    }).catch((error) => { this.props.setMessage(error.message) });
  }

  // log user out
  logout = () => {
    fire.auth().signOut().catch((error) => { this.props.setMessage(error.message) });
    if (this.props.message) this.props.setMessage('');
  }

  // switch from admin to student account
  switchToStudent = () => {
    this.props.setAccount('student');
  }

  // toggle whether to show reset password form
  toggleReset = () => {
    const switchState = !this.state.pwdReset;
    this.setState({ 
      email: '',
      password: '',
      pwdReset: switchState 
    });
    if (this.props.message) this.props.setMessage('');
  }

  // send password reset email
  pwdReset = (e) => {
    e.preventDefault();
    fire.auth().sendPasswordResetEmail(this.state.email).then(() => {
      this.setState({ 
        email: '',
        passwords: '',
        pwdReset: false 
      });
      window.alert('An email has been sent to the registered admin email!');
    }).catch(error => this.props.setMessage(error.message))
  }
  
  render() {
    // show login form or logout link depending on user login state
    let logInOut = null;
    let switchAccounts = null;
    // if a user has been set, show log out link
    if (this.props.user) {
      logInOut = <li><a onClick={this.logout}>log out admin</a></li> /* eslint-disable-line */
      // if user is on admin side show link to go to student side
      if (this.props.account === 'admin') {
        switchAccounts = <li><a onClick={this.switchToStudent}>switch to student sign-in</a></li> /* eslint-disable-line */
      }
    // no one is logged in so show log in form
    } else {
      logInOut = (
        <AuthorizeForm 
          handleTermChange={this.handleTermChange}
          state={this.state} 
          login={this.login}
          showResetForm={this.state.pwdReset}
          toggleReset={this.toggleReset}
          pwdReset={this.pwdReset} />
      )
    }

    return (
      <ul>
        {switchAccounts}
        {logInOut}
      </ul>
    )
  }
}

export default Authorize;