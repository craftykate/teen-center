import fire from './fire';
import axios from './axios';

const utilities = {
  getToken() {
    return fire.auth().currentUser.getIdToken(true)
  },

  getDateInfo(dateString) {
    const now = new Date(dateString);
    return {
      now,
      year: now.getFullYear(),
      month: now.getMonth(),
      day: now.getDate()
    }
  },

  // check if id exists at a certain link
  doesIDExist(token, link, ID) {
    return axios.get(`${link}?auth=${token}&shallow=true`).then(records => {
      console.log(`getting ${link} ids`);
      // if there are ids at this link...
      if (records.data) {
        // turn keys of ids into an array
        const ids = Object.keys(records.data);
        // if id exists return true, otherwise return false
        return ids.includes(`id-${ID}`) ? true : false;
        // no ids at this link
      } else {
        return false;
      }
    }).catch(error => console.log(error.message));
  }
};

export default utilities;