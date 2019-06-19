<template>
  <section class="columns section">
    <b-modal :active.sync="isModalActive">
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
    </b-modal>

    <div class="column is-7 container">
      <n-link id="go-back" :to="`/city/${place.city}`" class="is-text"
        >⬅️Back to the map page</n-link
      >
      <h2 id="place-name" class="title is-2">{{ place.name }}</h2>
      <a
        v-show="isLiked === false"
        class="button is-outlined is-product-color nav-menu-enclosure"
        @click.prevent="like"
        >Like 👍</a
      >

      <a
        v-show="isLiked"
        class="button is-product-color nav-menu-enclosure"
        @click.prevent="unlike"
        >Liked ✔️</a
      >

      <n-link class="button is-text" :to="`/place/${placeId}/edit`"
        >Edit</n-link
      >

      <div class="columns">
        <div class="column">
          <div class="cont">
            <h3 class="title">♥️ Likes</h3>
            <p class="subtitle">
              <span v-if="likeCount > 0">{{ likeCount }}</span>
              <span v-if="likeCount === 0">🥚</span>
            </p>
          </div>

          <div class="cont">
            <h3 class="title">
              🏷️Tags
            </h3>
            <div class="tags">
              <span
                v-for="tag in place.tags"
                :key="tag.id"
                class="tag is-danger is-medium"
              >
                {{ tag }}
              </span>
            </div>
          </div>
        </div>

        <div class="column">
          <table class="table">
            <tbody>
              <tr>
                <th>Mon</th>
                <td>
                  <span v-show="place.businessHours.mon.isHoliday">Closed</span>
                  <span v-show="place.businessHours.mon.isHoliday === false">
                    {{ place.businessHours.mon.open }} -
                    {{ place.businessHours.mon.close }}
                  </span>
                </td>
              </tr>
              <tr>
                <th>Tue</th>
                <td>
                  <span v-show="place.businessHours.tue.isHoliday">Closed</span>
                  <span v-show="place.businessHours.tue.isHoliday === false">
                    {{ place.businessHours.tue.open }} -
                    {{ place.businessHours.tue.close }}
                  </span>
                </td>
              </tr>
              <tr>
                <th>Wed</th>
                <td>
                  <span v-show="place.businessHours.wed.isHoliday">Closed</span>
                  <span v-show="place.businessHours.wed.isHoliday === false">
                    {{ place.businessHours.wed.open }} -
                    {{ place.businessHours.wed.close }}
                  </span>
                </td>
              </tr>
              <tr>
                <th>Thu</th>
                <td>
                  <span v-show="place.businessHours.thu.isHoliday">Closed</span>
                  <span v-show="place.businessHours.thu.isHoliday === false">
                    {{ place.businessHours.thu.open }} -
                    {{ place.businessHours.thu.close }}
                  </span>
                </td>
              </tr>
              <tr>
                <th>Fri</th>
                <td>
                  <span v-show="place.businessHours.fri.isHoliday">Closed</span>
                  <span v-show="place.businessHours.fri.isHoliday === false">
                    {{ place.businessHours.fri.open }} -
                    {{ place.businessHours.fri.close }}
                  </span>
                </td>
              </tr>
              <tr>
                <th>Sat</th>
                <td>
                  <span v-show="place.businessHours.sat.isHoliday">Closed</span>
                  <span v-show="place.businessHours.sat.isHoliday === false">
                    {{ place.businessHours.sat.open }} -
                    {{ place.businessHours.sat.close }}
                  </span>
                </td>
              </tr>
              <tr>
                <th>Sun</th>
                <td>
                  <span v-show="place.businessHours.sun.isHoliday">Closed</span>
                  <span v-show="place.businessHours.sun.isHoliday === false">
                    {{ place.businessHours.sun.open }} -
                    {{ place.businessHours.sun.close }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
/* eslint-disable no-console,no-unused-vars */
import uuid from 'uuid/v4'
import asyncForEach from '~/plugins/asyncForEach'
import twemoji from 'twemoji'

import firebase from '~/plugins/firebase'
// Use firestore
import 'firebase/firestore'
const firestore = firebase.firestore()

const googleProvider = new firebase.auth.GoogleAuthProvider()
const facebookProvider = new firebase.auth.FacebookAuthProvider()
const twitterProvider = new firebase.auth.TwitterAuthProvider()

export default {
  name: 'PlaceId',
  middleware: ['setLoginUser'],
  data() {
    return {
      placeId: '',
      isLiked: false,
      placesLikesRef: null,
      usersLikesRef: null,
      likeCount: '',
      isModalActive: false
    }
  },
  async asyncData({ params }) {
    try {
      const result = await firestore
        .collection('places')
        .doc(params.id)
        .get()
      const place = result.data()
      console.log(place.businessHours)
      if (place.businessHours === undefined) {
        console.log('aaa')
        place.businessHours = {
          mon: {
            isHoliday: false
          },
          tue: {
            isHoliday: false
          },
          wed: {
            isHoliday: false
          },
          thu: {
            isHoliday: false
          },
          fri: {
            isHoliday: false
          },
          sat: {
            isHoliday: false
          },
          sun: {
            isHoliday: false
          }
        }
      }
      return { place }
    } catch (err) {
      console.log('here')
      console.log(err)
    }
  },
  async created() {
    this.placeId = this.$nuxt.$route.params.id
    this.placesLikesRef = firestore
      .collection('places')
      .doc(this.placeId)
      .collection('likes')
    // Get like count
    const res = await firestore
      .collection('places')
      .doc(this.placeId)
      .collection('likes')
      .get()
    this.likeCount = res.size

    if (this.$store.getters.getLoginStatus === false) {
      return
    }
    this.usersLikesRef = firestore
      .collection('users')
      .doc(this.$store.getters.getUserInfo.uid)
      .collection('likes')

    // check if this place is liked
    const result = await this.usersLikesRef
      .where('placeId', '==', this.placeId)
      .get()
    if (result.empty === false) {
      this.isLiked = true
    }
  },
  mounted() {
    twemoji.parse(document.body)
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
    },
    async like() {
      if (this.$store.getters.getLoginStatus === false) {
        this.isModalActive = true
        return
      }
      const id = uuid()
        .split('-')
        .join('')
      await Promise.all([
        this.placesLikesRef.doc(id).set({
          userId: this.$store.getters.getUserInfo.uid
        }),
        this.usersLikesRef.doc(id).set({ placeId: this.placeId })
      ])
      this.isLiked = true
      this.likeCount++
    },
    async unlike() {
      const result = await this.usersLikesRef
        .where('placeId', '==', this.placeId)
        .get()
      const id = result.docs[0].id
      await Promise.all([
        this.usersLikesRef.doc(id).delete(),
        this.placesLikesRef.doc(id).delete()
      ])
      this.isLiked = false
      this.likeCount--
    }
  }
}
</script>

<style lang="scss" scoped>
.title.is-3 {
  font-weight: 700;
}
#place-name {
  margin-bottom: 0;
}
.cont {
  margin: 30px 0;
}
#go-back {
  display: block;
  margin-bottom: 10px;
}

.table {
  font-size: 0.9rem;
  .table th {
    padding: 0.2em 0.75em;
  }
}
table,
th,
td {
  border: none;
}
</style>
