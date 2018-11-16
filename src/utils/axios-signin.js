import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://teen-center-sign-in.firebaseio.com/'
});

export default instance;