import React from 'react';
import Header from '../Header/Header';

const layout = (props) => (
  <React.Fragment>
    <Header />
    <main>
      {props.children}
    </main>
  </React.Fragment>
);

export default layout;