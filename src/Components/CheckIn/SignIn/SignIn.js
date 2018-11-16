import React, {Component} from 'react';

// sign in a student
class SignIn extends Component {
  state = {
    searchTerm: ''
  }

  // update state with contents of input field
  handleTermChange = (e) => {
    this.setState({
      searchTerm: e.target.value
    })
  }

  // check if ID exists in database
  validateID = (e) => {
    // if "enter" key pressed and input isn't empty...
    if (e.key === 'Enter' && this.state.searchTerm) {
      





      // reset search field
      this.setState({
        searchTerm: ''
      });
      this.props.signIn(e.target.value);






    }
  }

  render() {
    return (
      <React.Fragment>
        <p>Sign In</p>
        <input type="text"
          onChange={this.handleTermChange}
          onKeyPress={this.validateID}
          placeholder="Student ID"
          value={this.state.searchTerm} />
      </React.Fragment>
    )
  }
};

export default SignIn;