import Axios from 'axios';
import constants from './Constant';

const jsonPlaceholderAPI = Axios.create({
  baseURL: constants.Baseurl,
  timeout: 1000,
});

export default jsonPlaceholderAPI;
