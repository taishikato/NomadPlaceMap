import firebase from '~/plugins/firebase'

export default function() {
  return new Promise((resolve, reject) => {
    firebase
      .auth()
      .getRedirectResult()
      .then(result => {
        resolve(result)
      })
      .catch(e => {
        reject(e)
      })
  })
}
