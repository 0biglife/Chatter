import axios from 'axios';
import Config from 'react-native-config';

const client = axios.create({
  baseURL: 'https://api.unsplash.com',
  params: {
    client_id: `${Config.UNSPLASH_ACCESSTOKEN}`,
  },
});

export default client;
