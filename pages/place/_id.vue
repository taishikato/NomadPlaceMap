<template>
  <section class="columns section">
    <div class="column is-7 container">
      <h2 id="place-name" class="title is-2">{{ place.name }}</h2>
      <a
        class="button is-outlined is-product-color nav-menu-enclosure"
        @click.prevent="like"
        >Like 👍</a
      >

      <!-- <nav class="level is-mobile">
        <div class="level-item has-text-centered">
          <div>
            <p class="heading">Likes 👍</p>
            <p class="title">3,456</p>
          </div>
        </div>
        <div class="level-item has-text-centered">
          <div>
            <p class="heading">Made by 😎</p>
            <p class="title">Takato</p>
          </div>
        </div>
      </nav> -->

      <div class="cont">
        <h3 class="title">Likes</h3>
        <p class="subtitle">2534</p>
      </div>

      <div class="cont">
        <h3 class="title">Tags</h3>
        <div class="tags">
          <span class="tag is-danger is-medium">nomad</span>
          <span class="tag is-danger is-medium">coffee</span>
          <span class="tag is-danger is-medium">24/7</span>
          <span class="tag is-danger is-medium">wifi</span>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
/* eslint-disable no-console,no-unused-vars */

import firebase from '~/plugins/firebase'
// Use firestore
import 'firebase/firestore'
const firestore = firebase.firestore()

export default {
  name: 'PlaceId',
  async asyncData({ params }) {
    try {
      const result = await firestore
        .collection('places')
        .doc(params.id)
        .get()
      return { place: result.data() }
    } catch (err) {
      console.log(err)
    }
  },
  methods: {
    async like() {
      // await Promise.all([
      //   firestore
      //     .collection('places')
      //     .doc()
      //     .collection('likes')
      //     .add(),
      //   firestore
      //     .collection('users')
      //     .doc()
      //     .collection('likes')
      //     .add(),
      // ])
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
</style>
