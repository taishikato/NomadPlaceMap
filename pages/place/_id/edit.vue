<template>
  <section id="place-id-edit" class="section columns">
    <div class="column is-7 container">
      <n-link id="go-back" :to="`${placePageUrl}`" class="button is-text"
        >⬅️Back to the place page</n-link
      >
      <h2 class="title is-2">Edit</h2>
      <h3 id="place-name" class="title is-3">{{ place.name }}</h3>
      <div class="field is-grouped is-grouped-multiline">
        <div v-for="tag in tags" :key="tag.id" class="control">
          <div class="tags has-addons">
            <span class="tag is-danger is-medium">{{ tag }}</span>
            <a class="tag is-delete is-medium"></a>
          </div>
        </div>
      </div>
      <div class="field">
        <label class="label">Tags</label>
        <div class="control">
          <div class="select">
            <select v-model="selected">
              <option value="nomad">Nomad</option>
              <option value="cafe">Cafe</option>
              <option value="wifi">Wifi</option>
            </select>
          </div>
        </div>
      </div>

      <div class="field">
        <div class="control">
          <button class="button is-light" @click.prevent="addTag($event)">
            Add
          </button>
        </div>
      </div>

      <div class="field">
        <div class="control">
          <button id="save-btn" class="button is-info" @click.prevent="saveTag">
            Save
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
/* eslint-disable no-console */

import twemoji from 'twemoji'

import firebase from '~/plugins/firebase'
// Use firestore
import 'firebase/firestore'
const firestore = firebase.firestore()

export default {
  name: 'PlaceIdEdit',
  data() {
    return {
      selected: 'nomad',
      tags: [],
      placeId: '',
      place: {},
      placePageUrl: ''
    }
  },
  async created() {
    this.placeId = this.$nuxt.$route.params.id
    this.placePageUrl = `/place/${this.placeId}`
    const placeData = await firestore
      .collection('places')
      .doc(this.placeId)
      .get()
    const place = placeData.data()
    this.place = place
    if (place.tags !== undefined && Array.isArray(place.tags)) {
      this.tags = place.tags
    }
  },
  mounted() {
    twemoji.parse(document.body)
  },
  methods: {
    addTag(event) {
      this.tags.unshift(this.selected)
    },
    async saveTag() {
      await firestore
        .collection('places')
        .doc(this.placeId)
        .update({
          tags: this.tags
        })
    }
  }
}
</script>

<style lang="scss" scoped>
#go-back {
  margin-bottom: 10px;
}
#save-btn {
  width: 100%;
}
</style>
