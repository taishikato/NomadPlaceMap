import firebase from 'firebase'

if (!firebase.apps.length) {
  firebase.initializeApp({
    apiKey: 'AIzaSyBSqqSE8vAV2P04PGl4Dtz6zhc2sL6qo88',
    authDomain: 'hangout-map.firebaseapp.com',
    databaseURL: 'https://hangout-map.firebaseio.com',
    projectId: 'hangout-map',
    storageBucket: 'hangout-map.appspot.com',
    messagingSenderId: '49021875088',
    appId: '1:49021875088:web:cbeaa73a32f3e0d9'
  })
}
export default firebase
