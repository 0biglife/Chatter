import axios from 'axios';

const unsplashClient = axios.create({
  baseURL: 'https://api.unsplash.com',
});

export default unsplashClient;
