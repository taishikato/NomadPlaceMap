import Vue from 'vue'
import Vuex from 'vuex'

import firebase from '~/plugins/firebase'
import 'firebase/firestore'
import { firebaseMutations, firebaseAction } from 'vuexfire'
const firestore = firebase.firestore()
const usersRef = firestore.collection('users')

Vue.use(Vuex)

const store = () =>
  new Vuex.Store({
    state: {
      loginStatus: false,
      user: {} // Will be bound with firebase
    },
    getters: {
      getLoginStatus: state => state.loginStatus,
      getUserInfo: state => state.user
    },
    mutations: {
      changeLoginStatus(state, isLogin) {
        state.loginStatus = isLogin.status
      },
      changeUser(state, data) {
        state.user = data.user
      },
      ...firebaseMutations
    },
    actions: {
      BIND_USER: firebaseAction(({ bindFirebaseRef }, user) => {
        bindFirebaseRef('user', usersRef.doc(user.uid))
      }),
      UNBIND_USER: firebaseAction(({ unbindFirebaseRef }) => {
        unbindFirebaseRef('user')
      })
    }
  })

export default store
