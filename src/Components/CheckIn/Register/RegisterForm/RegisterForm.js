import React from 'react';

// fields to register new students
const registerForm = (props) => (
  <React.Fragment>
    <input type="text"
      onChange={(e) => props.updateField(e, 'id')}
      placeholder="ID"
      value={props.state.id} />
    <input type="text"
      onChange={(e) => props.updateField(e, 'name')}
      placeholder="Your Name"
      value={props.state.name} />
    <input type="text"
      onChange={(e) => props.updateField(e, 'school')}
      placeholder="Current School"
      value={props.state.school} />
    <button onClick={props.validateInfo}>Register</button>
    {/* eslint-disable-next-line */}
    <a onClick={props.toggleRegister}>(cancel)</a>
  </React.Fragment>
);

export default registerForm;