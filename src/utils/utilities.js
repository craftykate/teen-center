import fire from './fire';

const utilities = {
  getToken() {
    return fire.auth().currentUser.getIdToken(true)
  }
};

export default utilities;