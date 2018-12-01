import React from 'react';

// log in form
const authorizeForm = (props) => (
  <form autoComplete="off">
    <input
      value={props.state.email}
      onChange={props.handleTermChange}
      type="email"
      name="email"
      placeholder="Admin Email" />
    <input
      value={props.state.password}
      onChange={props.handleTermChange}
      type="password"
      name="password"
      placeholder="Password" />
    <button type="submit" onClick={(e) => props.login(e, 'student')}>Launch sign in page</button>
    <button type="submit" onClick={(e) => props.login(e, 'admin')}>Log in as Admin</button>
  </form>
);

export default authorizeForm;