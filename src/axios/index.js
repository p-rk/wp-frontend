import axios from 'axios';

const BASE_URL = process.env.NODE_ENV === 'production' ? 'https://whitepanda.cboxera.com/' : 'http://localhost:2019/';

const instance = axios.create({
    baseURL: BASE_URL,
    timeout: 1000,
  });

export default instance