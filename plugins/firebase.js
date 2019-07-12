import firebase from 'firebase'

if (!firebase.apps.length) {
  firebase.initializeApp({
    apiKey: 'AIzaSyCtxikc-wFo3UesWkXyHDS4GHrCmvOBsro',
    authDomain: 'nomadplacemap.firebaseapp.com',
    databaseURL: 'https://nomadplacemap.firebaseio.com',
    projectId: 'nomadplacemap',
    storageBucket: 'nomadplacemap.appspot.com',
    messagingSenderId: '574266788442',
    appId: '1:574266788442:web:2cd09d473381e6d3'
  })
}
export default firebase
