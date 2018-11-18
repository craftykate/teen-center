import React, { Component } from 'react';
import './App.css';
import fire from '../../utils/fire';
import Layout from '../Layout/Layout';
import Authorize from '../Authorize/Authorize';
import CheckIn from '../CheckIn/CheckIn';
import Reports from '../Reports/Reports';

class App extends Component {
  state = {
    user: null,
    account: ''
  };

  // listen if user logs in
  componentDidMount() {
    this.authListener();
  }

  // if user logs in, set user in state and storage
  authListener = () => {
    fire.auth().onAuthStateChanged((user) => {
      if (user) {
        this.setState({ 
          user,
          account: localStorage.getItem('account')
        });
        localStorage.setItem('user', user.uid);
      } else {
        this.setState({ 
          user: null,
          account: ''
        });
        localStorage.removeItem('user');
        localStorage.removeItem('account');
      }
    });
  }

  // set state for admin or student account
  setAccount = (account) => {
    if (account === 'student') {
      this.setState({
        account: 'student'
      })
    } else if (account === 'admin') {
      this.setState({
        account: 'admin'
      })
    } 
    localStorage.setItem('account', account);
  }

  render() {
    // show logged in content only if logged in, otherwise show login form
    let content = null;
    if (this.state.account === 'student') {
      content = <CheckIn />;
    } else if (this.state.account === 'admin') {
      content = <Reports />;
    } else {
      
    }
    return (
      <Layout user={this.state.user}>
        <Authorize 
          user={this.state.user} 
          setAccount={this.setAccount} />
        {content}
      </Layout>
    );
  }
}

export default App;
