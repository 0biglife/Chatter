import firebase from '@react-native-firebase/app';

const firebaseConfig = {
  apiKey: 'AIzaSyCaS4JWMbbrhSXlYb6W0B81qQo1GSRU28c',
  authDomain: 'chatter-d9c7e.firebaseapp.com',
  projectId: 'chatter-d9c7e',
  storageBucket: 'chatter-d9c7e.appspot.com',
  messagingSenderId: '548713126457',
  appId: '1:548713126457:web:2966ba7669f60314f48be8',
  measurementId: 'G-VH5Z4F9GFG',
};

export const app = firebase.initializeApp(firebaseConfig);
