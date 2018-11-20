import React from 'react';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';

const layout = (props) => (
  <div id="wrapper">
    <Header 
      user={props.user}
      setAccount={props.setAccount}
      setMessage={props.setMessage}
      message={props.message} />
    <main>
      {props.children}
    </main>
    <Footer />
  </div>
);

export default layout;