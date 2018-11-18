import React from 'react';
import Authorize from '../Authorize/Authorize';

const header = (props) => (
  <header>
    <h1>Benicia Teen Center</h1>
    <Authorize 
      user={props.user} 
      setAccount={props.setAccount} />
  </header>
);

export default header;