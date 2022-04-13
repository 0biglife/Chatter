import axios from 'axios';
import Config from 'react-native-config';

const client = axios.create({
  baseURL: 'https://api.openweathermap.org/data/2.5',
});

export default client;
