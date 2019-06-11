<template>
  <section class="columns section">
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
          <n-link class="button is-text" :to="`/place/${placeId}/edit`"
            >Edit</n-link
          >
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

export default {
  name: 'PlaceId',
  data() {
    return {
      placeId: '',
      isLiked: false,
      placesLikesRef: null,
      usersLikesRef: null,
      likeCount: ''
    }
  },
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
  async created() {
    this.placeId = this.$nuxt.$route.params.id
    this.placesLikesRef = firestore
      .collection('places')
      .doc(this.placeId)
      .collection('likes')
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

    // Get like count
    const res = await firestore
      .collection('places')
      .doc(this.placeId)
      .collection('likes')
      .get()
    this.likeCount = res.size
    console.log(this.likeCount)
  },
  mounted() {
    twemoji.parse(document.body)
  },
  methods: {
    async like() {
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
</style>
