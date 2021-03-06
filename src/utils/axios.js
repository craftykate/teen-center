import axios from 'axios';
import variables from './variables';

const instance = axios.create({
  baseURL: variables.FIREBASE.databaseURL
});

export default instance;