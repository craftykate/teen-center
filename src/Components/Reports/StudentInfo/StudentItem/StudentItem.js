import React, {Component} from 'react';

class StudentItem extends Component {
  state = {
    updatedContent: this.props.content,
    editable: false
  }

  makeEditable = () => {
    this.setState({ editable: !this.state.editable })
  }

  // update state with contents of input field
  handleTermChange = (e) => {
    this.setState({ updatedContent: e.target.value })
    if (this.props.message) this.props.setMessage('');
  }

  sendUpdate = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      e.target.blur();
      this.setState({ editable: !this.state.editable })
      this.props.updateRecord(e.target.value, this.props.studentKey, this.props.field);
    }
  }

  render() {
    return (
      <React.Fragment>
        <input type="text"
          className={this.props.field}
          onChange={this.handleTermChange}
          onKeyPress={(e) => this.sendUpdate(e)}
          value={this.state.updatedContent} />
      </React.Fragment>
    )
  }
}

export default StudentItem;