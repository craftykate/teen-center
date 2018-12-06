import React, {Component} from 'react';
import StudentForm from './StudentForm/StudentForm';

class Student extends Component {
  state = {}

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

  componentWillMount() {
    let newState = {};
    for (let item in this.officialState) {
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

  toggleVerified = (e) => {
    this.setState({ verified: e.target.checked })
    this.props.updateRecord(e.target.checked, this.props.student.id, 'verified', this.props.index);
  }

  sendUpdate = (e, field) => {
    if (e.key === 'Enter') {
      e.preventDefault();
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