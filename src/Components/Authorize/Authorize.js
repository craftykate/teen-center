import React, {Component} from 'react';
import fire from '../../utils/fire';

// log in to the site
class Authorize extends Component {
  state = {
    email: '',
    password: '',
    message: ''
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
        password: ''
      })
    this.props.setAccount(account);
    }).catch((error) => {
      console.log(error);
    });
  }

  // log user out
  logout = () => {
    fire.auth().signOut();
  }

  
  render() {

    // show login form or logout link depending on user state
    let logInOut = null;
    if (this.props.user) {
      logInOut = (
        /* eslint-disable-next-line */ 
        < a onClick={this.logout}>log out admin</a >
      )
    } else {
      logInOut = (
        <form>
          <input
            value={this.state.email}
            onChange={this.handleTermChange}
            type="email"
            name="email"
            placeholder="Admin Email" />
          <input
            value={this.state.password}
            onChange={this.handleTermChange}
            type="password"
            name="password"
            placeholder="Password" />
          <button type="submit" onClick={(e) => this.login(e, 'student')}>Launch sign in page</button>
          <button type="submit" onClick={(e) => this.login(e, 'admin')}>Log in as Admin</button>
        </form>
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