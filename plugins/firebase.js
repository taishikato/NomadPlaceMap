import firebase from 'firebase'

if (!firebase.apps.length) {
  firebase.initializeApp({
    apiKey: '<apiKey>',
    authDomain: '<authDomain>',
    databaseURL: '<databaseURL>',
    projectId: '<projectId>',
    storageBucket: '<storageBucket>',
    messagingSenderId: '<messagingSenderId>',
    appId: '<appId>'
  })
}
export default firebase
