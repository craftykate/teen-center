import React from 'react';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';

const layout = (props) => (
  <div id="wrapper">
    <Header 
      user={props.user}
      setAccount={props.setAccount}
      message={props.message}
      setMessage={props.setMessage} />
    <main>
      {props.children}
    </main>
    <Footer />
  </div>
);

export default layout;