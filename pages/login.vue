<template>
  <section id="login">
    <div id="login-content">
      <div id="model-box" class="loginBtn has-text-centered">
        <h3 class="title">NomadPlaceMap</h3>
        <button class="button google" @click.prevent="googleSignin">
          Google
        </button>
        <button class="button facebook" @click.prevent="facebookSignin">
          FaceBook
        </button>
        <button class="button twitter" @click.prevent="twitterSignin">
          Twitter
        </button>
      </div>
    </div>
  </section>
</template>

<script>
/* eslint-disable no-console */

import auth from '~/plugins/auth'
import getRedirectResult from '~/plugins/getRedirectResult'

import firebase from '~/plugins/firebase'
const googleProvider = new firebase.auth.GoogleAuthProvider()
const facebookProvider = new firebase.auth.FacebookAuthProvider()
const twitterProvider = new firebase.auth.TwitterAuthProvider()

export default {
  name: 'Login',
  async created() {
    console.log(this.$route.query)
    const authUser = await auth()
    if (authUser === false) return

    const result = await getRedirectResult()
    if (result.user !== null) {
      let path = this.$route.query
      if (Object.keys(this.$route.query).length === 0) {
        path = '/'
      }
      this.$toast.open({
        message: 'Yes! Logged in successfuly 😚',
        type: 'is-success',
        duration: 3000
      })
      this.$router.push(path)
    }
  },
  methods: {
    googleSignin() {
      firebase.auth().signInWithRedirect(googleProvider)
    },
    facebookSignin() {
      firebase.auth().signInWithRedirect(facebookProvider)
    },
    twitterSignin() {
      firebase.auth().signInWithRedirect(twitterProvider)
    }
  }
}
</script>

<style lang="scss" scoped>
#login {
  width: 100vw;
  height: 100vh;
  background-position: center center;
  background-repeat: no-repeat;
  background-attachment: fixed;
  background-size: cover;
  background-image: url('/nomad-working.jpg');
  #login-content {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100vw;
    height: 100vh;
    background-color: rgba(10, 10, 10, 0.55);
  }
}
</style>
