<template>
  <div class="layout-container">
    <h1 class="title is-product-color">
      <n-link to="/">
        🚶
      </n-link>
    </h1>

    <nuxt style="z-index: 100;" />

    <nav
      class="navbar is-fixed-bottom"
      role="navigation"
      aria-label="main navigation"
    >
      <div class="navbar-brand">
        <n-link class="navbar-item" to="/">
          🚶
        </n-link>
        <a
          role="button"
          class="navbar-burger burger"
          aria-label="menu"
          aria-expanded="false"
          data-target="navbarBasicExample"
        >
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </a>
      </div>
      <div id="navbarBasicExample" class="navbar-menu">
        <div class="navbar-start">
          <a
            href="https://taishikato.com/?ref=hangoutmap"
            class="navbar-item"
            target="_blank"
          >
            By Taishi
          </a>
          <div class="navbar-item">
            <a @click.prevent="emailPasswordLogin">
              Sign Up with Email and Password
            </a>
          </div>
          <div class="navbar-item">
            <a @click.prevent="googleSignin">Sign Up with Google</a>
          </div>
          <div class="navbar-item">
            <a @click.prevent="facebookSignin">Sign Up with Facebook</a>
          </div>
          <div class="navbar-item">
            <a @click.prevent="logout">Log Out</a>
          </div>
        </div>
        <div class="navbar-end">
          <div class="navbar-item">
            <a>
              FeedBack
            </a>
          </div>
        </div>
      </div>
    </nav>
  </div>
</template>

<script>
/* eslint-disable no-console */

import twemoji from 'twemoji'
import firebase from '~/plugins/firebase'

const googleProvider = new firebase.auth.GoogleAuthProvider()
const facebookProvider = new firebase.auth.FacebookAuthProvider()

export default {
  middleware: ['setLoginUser'],
  data() {
    return {
      searchQuery: ''
    }
  },
  mounted() {
    twemoji.parse(document.body)
  },
  methods: {
    async emailPasswordLogin() {
      console.log('emailPasswordLogin')
      const email = 'taishi.k0903@gmail.com'
      const password = '000011'
      const result = await firebase
        .auth()
        .createUserWithEmailAndPassword(email, password)
      console.log(result)
    },
    googleSignin() {
      firebase.auth().signInWithRedirect(googleProvider)
    },
    facebookSignin() {
      firebase.auth().signInWithRedirect(facebookProvider)
    },
    async logout() {
      // Logout
      try {
        await firebase.auth().signOut()
        // Firestoreとアンバインド
        await this.$store.dispatch('UNBIND_USER')
        // CommitでVuexの値を変更
        this.$store.commit('changeUser', {
          user: {}
        })
        this.$store.commit('changeLoginStatus', {
          status: false
        })
      } catch (err) {
        this.$toast.open({
          message: 'Failed to Log Out… Please try again later',
          type: 'is-danger',
          duration: 3000
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.title {
  height: 50px;
  font-size: 30px;
  font-weight: bold;
  position: absolute;
  top: 10px;
  left: 50px;
  z-index: 200;
  background-color: white;
  padding: 10px;
  border-radius: 4px;
  background-color: hsl(348, 100%, 61%);
  a {
    font-weight: 900;
    &:hover {
      color: #fff;
    }
  }
}

#makerwidget {
  z-index: 200;
}
</style>
