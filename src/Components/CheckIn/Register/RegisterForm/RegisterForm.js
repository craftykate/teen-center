import React from 'react';

// fields to register new students
const registerForm = (props) => (
  <form autoComplete="off">
    <h2>Register New Student</h2>
    <label htmlFor="id">Careful - your ID can't be changed!</label>
    <input type="text"
      name="id"
      onChange={(e) => props.updateField(e, 'id')}
      placeholder="Your school ID #"
      value={props.state.id} />

    <input type="text"
      onChange={(e) => props.updateField(e, 'name')}
      placeholder="Your name"
      value={props.state.name} />

    <input type="text"
      onChange={(e) => props.updateField(e, 'phone')}
      placeholder="Your cell phone #"
      value={props.state.phone} />

    <input type="text"
      onChange={(e) => props.updateField(e, 'school')}
      placeholder="Current school"
      value={props.state.school} />

    <input type="text"
      onChange={(e) => props.updateField(e, 'year')}
      placeholder="Graduation year"
      value={props.state.year} />

    <input type="text"
      onChange={(e) => props.updateField(e, 'parents')}
      placeholder="Parent/guardian name(s)"
      value={props.state.parents} />

    <input type="text"
      onChange={(e) => props.updateField(e, 'parentPhone')}
      placeholder="Parent/guardian cell phone #"
      value={props.state.parentPhone} />

    <input 
      type="checkbox" 
      value={props.state.agree} 
      onChange={props.toggleCheckbox} /><span className="checkbox-text">I have received the rules for the Benicia Teen Center and agree to follow them</span><br/>

    <button onClick={(e) => props.validateInfo(e, 'regOnly')}>Register Only</button>
    <button onClick={(e) => props.validateInfo(e, 'regAndSignIn')}>Register and Sign In</button>
    <a onClick={props.toggleRegister}>(cancel)</a> {/* eslint-disable-line */}
  </form>
);

export default registerForm;