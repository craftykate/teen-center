import React from 'react';

// editable form with the info on a student on the look up students page. Each student in the results renders one of these forms
const studentForm = (props) => {
  // if the current page is the graduated students, show a box to delete the student
  let deleteBox = null;
  if (props.letter === 'graduates') {
    deleteBox = (
      <React.Fragment>
        <label htmlFor="delete">Delete Record?</label>
        <input type="checkbox"
          checked={false}
          onChange={() => props.deleteStudent(props.index, props.id, props.student.name)} />
      </React.Fragment>
    )
  }

  return (
    <form id="results">
      <label htmlFor="name">ID: {props.id}</label>
      <input type="text"
        className="name"
        onChange={(e) => props.updateField(e, 'name')}
        onKeyPress={(e) => props.sendUpdate(e, 'name')}
        onBlur={() => props.resetValue('name')}
        value={props.student.name} />
      <label htmlFor="phone">Student Phone:</label>
      <input type="text"
        className="phone"
        onChange={(e) => props.updateField(e, 'phone')}
        onKeyPress={(e) => props.sendUpdate(e, 'phone')}
        onBlur={() => props.resetValue('phone')}
        value={props.student.phone} />
      <label htmlFor="school">School:</label>
      <input type="text"
        className="school"
        onChange={(e) => props.updateField(e, 'school')}
        onKeyPress={(e) => props.sendUpdate(e, 'school')}
        onBlur={() => props.resetValue('school')}
        value={props.student.school} />
      <label htmlFor="year">Grad Year:</label>
      <input type="text"
        className="year"
        onChange={(e) => props.updateField(e, 'year')}
        onKeyPress={(e) => props.sendUpdate(e, 'year')}
        onBlur={() => props.resetValue('year')}
        value={props.student.year} />
      <label htmlFor="parents">Parents:</label>
      <input type="text"
        className="parents"
        onChange={(e) => props.updateField(e, 'parents')}
        onKeyPress={(e) => props.sendUpdate(e, 'parents')}
        onBlur={() => props.resetValue('parents')}
        value={props.student.parents} />
      <label htmlFor="parentPhone">Parent Phone:</label>
      <input type="text"
        className="parentPhone"
        onChange={(e) => props.updateField(e, 'parentPhone')}
        onKeyPress={(e) => props.sendUpdate(e, 'parentPhone')}
        onBlur={() => props.resetValue('parentPhone')}
        value={props.student.parentPhone} />
      <label htmlFor="notes">Notes:</label>
      <textarea type="text"
        className="notes"
        onChange={(e) => props.updateField(e, 'notes')}
        onKeyPress={(e) => props.sendUpdate(e, 'notes')}
        onBlur={() => props.resetValue('notes')}
        value={props.student.notes} />
      <label htmlFor="verified">Verified?</label>
      <input type="checkbox"
        onChange={(e) => props.toggleVerified(e)}
        checked={!!props.student.verified} />
      {deleteBox}
    </form>
  )
};

export default studentForm;