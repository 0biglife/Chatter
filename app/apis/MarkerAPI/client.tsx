import axios from 'axios';
import Config from 'react-native-config';
import {Platform} from 'react-native';

const client = axios.create({
  baseURL: Platform.OS === 'ios' ? Config.API_URL_IOS : Config.API_URL_AOS,
});

export default client;
