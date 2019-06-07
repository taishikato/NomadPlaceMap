import firebase from '~/plugins/firebase'

export default function auth() {
  return new Promise(resolve => {
    firebase.auth().onAuthStateChanged(user => {
      resolve(user || false)
    })
  })
}
