import firebase from 'firebase/app';
import 'firebase/auth';
import variables from './variables';

// info from web setup on firebase site (on variables page)
const config = {
  apiKey: variables.FIREBASE.apiKey,
  authDomain: variables.FIREBASE.authDomain,
  databaseURL: variables.FIREBASE.databaseURL,
  projectId: variables.FIREBASE.projectId,
  storageBucket: variables.FIREBASE.storageBucket,
  messagingSenderId: variables.FIREBASE.messagingSenderId
};

const fire = firebase.initializeApp(config);

export default fire;