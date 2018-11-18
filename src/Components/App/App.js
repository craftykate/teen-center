import React, { Component } from 'react';
import './App.css';
import fire from '../../utils/fire';
import Layout from '../Layout/Layout';
import Authorize from '../Authorize/Authorize';
import CheckIn from '../CheckIn/CheckIn';

class App extends Component {
  state = {
    user: null
  };

  // listen if user logs in
  componentDidMount() {
    this.authListener();
  }

  // if user logs in, set user in state and storage
  authListener = () => {
    fire.auth().onAuthStateChanged((user) => {
      if (user) {
        this.setState({ user });
        localStorage.setItem('user', user.uid);
      } else {
        this.setState({ user: null });
        localStorage.removeItem('user');
      }
    });
  }

  render() {
    // show logged in content only if logged in, otherwise show login form
    const studentContent = this.state.user ? <CheckIn /> : null;
    return (
      <Layout user={this.state.user}>
        <Authorize user={this.state.user} />
        {studentContent}
      </Layout>
    );
  }
}

export default App;
