import React from 'react';
import Header from '../Header/Header';

const layout = (props) => (
  <div id="wrapper">
    <Header />
    <main>
      {props.children}
    </main>
  </div>
);

export default layout;