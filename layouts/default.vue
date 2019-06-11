<template>
  <div class="layout-container">
    <h1 class="title brand is-product-color">
      <n-link to="/">
        🚶
      </n-link>
    </h1>

    <nuxt style="z-index: 100;" />

    <b-modal :active.sync="isModalActive">
      <div id="model-box" class="loginBtn has-text-centered">
        <h3 class="title">HangoutMap</h3>
        <button class="button google" @click.prevent="googleSignin">
          Google
        </button>
        <button class="button facebook" @click.prevent="facebookSignin">
          FaceBook
        </button>
        <button class="button twitter" @click.prevent="twitterSignin">
          Twitter
        </button>
        <!-- <div class="field">
          <div class="control">
            <h4 class="title is-4">aa</h4>
          </div>
        </div>
        <div class="field">
          <div class="control">
            aaa
          </div>
        </div> -->
      </div>
    </b-modal>

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
          v-if="$store.getters.getLoginStatus === false"
          class="navbar-item"
          @click.prevent="showModal"
        >
          Sign Up / Log In
        </a>
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
      <div id="navbarBasicExample" class="navbar-menu is-mobile">
        <div class="navbar-start">
          <div class="navbar-item">
            <a @click.prevent="logout">Log Out</a>
          </div>
        </div>
        <div class="navbar-end">
          <a
            href="https://taishikato.com/?ref=hangoutmap"
            class="navbar-item"
            target="_blank"
          >
            By Taishi
          </a>
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
const twitterProvider = new firebase.auth.TwitterAuthProvider()

export default {
  middleware: ['setLoginUser'],
  data() {
    return {
      searchQuery: '',
      isModalActive: false
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
    twitterSignin() {
      firebase.auth().signInWithRedirect(twitterProvider)
    },
    showModal() {
      this.isModalActive = true
    },
    loginWithFacebook() {
      console.log('loginWithFacebook')
    },
    loginWithTwitter() {
      console.log('loginWithTwitter')
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
.title.brand {
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

#model-box {
  .title {
    color: white;
  }
}
.loginBtn {
  .button {
    display: block;
    color: white;
    width: 200px;
    max-width: 80%;
    margin: 10px auto;
    font-weight: 900;
  }
  .facebook {
    border-color: #3c5798;
    background-color: #3c5798;
  }

  .twitter {
    border-color: #00aced;
    background-color: #00aced;
  }

  .google {
    color: #363636;
    border-color: #ffffff;
    background-color: #ffffff;
  }
}
</style>
