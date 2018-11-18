import axios from 'axios';
import variables from './variables';

const instance = axios.create({
  baseURL: variables.BASE_URL
});

export default instance;