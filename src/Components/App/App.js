import React, { Component } from 'react';
import './App.css';
import Layout from '../Layout/Layout';
import CheckIn from '../CheckIn/CheckIn';

class App extends Component {
  render() {
    return (
      <Layout>
        <CheckIn />
      </Layout>
    );
  }
}

export default App;
