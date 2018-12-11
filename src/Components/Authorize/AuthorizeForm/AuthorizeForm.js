import React from 'react';

// log in form
const authorizeForm = (props) => {
  let form = (
    <form autoComplete="off">
      <input type="email" autoFocus
        name="email"
        onChange={props.handleTermChange}
        placeholder="Admin Email"
        value={props.state.email} />
      <input type="password"
        name="password"
        onChange={props.handleTermChange}
        placeholder="Password"
        value={props.state.password} />
      <button type="submit" onClick={(e) => props.login(e, 'student')}>Launch sign in page</button>
      <button type="submit" onClick={(e) => props.login(e, 'admin')}>Log in as Admin</button> <br/>
      <a onClick={props.toggleReset}>(reset password)</a> {/* eslint-disable-line */}
    </form>
  );
  // if reset password was clicked show that form instead
  if (props.showResetForm) {
    form = (
      <form autoComplete="off">
        <label htmlFor="email">Enter email on Admin account:</label>
        <input autoFocus
          value={props.state.email}
          onChange={props.handleTermChange}
          type="email"
          name="email"
          placeholder="Admin Email" />
        <button type="submit" onClick={props.pwdReset}>Send Password Reset Email</button>
        <a onClick={props.toggleReset}>(cancel)</a> {/* eslint-disable-line */}
      </form>
    )
  }
  
  return (
    form
  )
}


export default authorizeForm;