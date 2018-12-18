import React, {Component} from 'react';
import StudentForm from './StudentForm/StudentForm';

// student result on the look up students page. Each student renders one of these components
class Student extends Component {
  state = {} // student info from database

  // with this I can reset the state to the original settings if user clicks away from a field without saving
  officialState = {
    name: this.props.student.name,
    phone: this.props.student.phone,
    school: this.props.student.school,
    year: this.props.student.year,
    parents: this.props.student.parents,
    parentPhone: this.props.student.parentPhone,
    notes: this.props.student.notes,
    verified: this.props.student.verified
  }

  // load the original settings into state when component mounts
  componentWillMount() {
    let newState = {};
    for (let item in this.officialState) {
      // if that field wasn't defined set it to an empty string to avoid later errors
      if (this.officialState[item] === undefined) {
        newState[item] = '';
      } else {
        newState[item] = this.officialState[item]
      }
    }
    this.setState({ ...newState })
  }

  // update the correct state field with whatever has been typed in
  updateField = (e, fieldName) => {
    this.setState({ [fieldName]: e.target.value })
    if (this.props.message) this.props.setMessage('');
  }

  // toggles whether student is verified
  toggleVerified = (e) => {
    this.setState({ verified: e.target.checked })
    this.props.updateRecord(e.target.checked, this.props.student.id, 'verified', this.props.index);
  }

  // send edited info up to parent component to save it in the database, then take focus away from that field
  sendUpdate = (e, field) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      // verify the year field is a 4 digit number
      if (field === 'year') {
        if (/^\d+$/.test(e.target.value) && e.target.value.length === 4) {
          this.officialState[field] = e.target.value;
          this.props.updateRecord(e.target.value, this.props.student.id, field, this.props.index);
          e.target.blur();
        } else {
          window.alert('NOT SAVED: Graduation year must be a four digit number');
        }
      } else {
        this.officialState[field] = e.target.value;
        this.props.updateRecord(e.target.value, this.props.student.id, field, this.props.index);
        e.target.blur();
      }
    }
  }

  // reset the value of the field to the original state (or the saved state) when user clicks away from the field
  resetValue = (field) => {
    if (this.officialState[field] === undefined) {
      this.setState({ [field]: '' })
    } else {
      this.setState({ [field]: this.officialState[field]})
    }
  }

  render() {
    return (
      <StudentForm
        letter={this.props.letter}
        index={this.props.index}
        id={this.props.student.id}
        student={this.state}
        updateField={this.updateField}
        sendUpdate={this.sendUpdate}
        resetValue={this.resetValue}
        toggleVerified={this.toggleVerified}
        deleteStudent={this.props.deleteStudent} />
    )
  }
}

export default Student;