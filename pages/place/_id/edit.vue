<template>
  <section id="place-id-edit" class="section columns">
    <div class="column is-7 container">
      <n-link id="go-back" :to="`${placePageUrl}`" class="is-text"
        >⬅️Back to the place page</n-link
      >
      <h2 class="title is-2">Edit</h2>
      <h3 id="place-name" class="title is-3">{{ place.name }}</h3>

      <div id="businesshours-edit">
        <h4 class="title is-4">🕒Business Hours</h4>

        <table class="table">
          <thead>
            <tr>
              <th>Day</th>
              <th>Open</th>
              <th>Close</th>
              <th>Holiday</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(businessHour, key) in businessHours"
              :key="businessHour.id"
            >
              <th>{{ key.charAt(0).toUpperCase() + key.slice(1) }}</th>
              <td>
                <input
                  v-model="businessHour.open"
                  class="input"
                  type="text"
                  placeholder="8:00 am"
                  size="10"
                />
              </td>
              <td>
                <input
                  v-model="businessHour.close"
                  class="input"
                  type="text"
                  placeholder="7:00 pm"
                  size="10"
                />
              </td>
              <td>
                <input v-model="businessHour.isHoliday" type="checkbox" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <h4 class="title is-4">🏷️Tags</h4>

      <div class="field is-grouped is-grouped-multiline">
        <div v-for="(tag, index) in tags" :key="tag.id" class="control">
          <div class="tags has-addons">
            <span class="tag is-danger is-medium">{{ tag }}</span>
            <a
              class="tag is-delete is-medium"
              @click.prevent="deleteTag(index)"
            ></a>
          </div>
        </div>
      </div>

      <div class="field">
        <label class="label">Tags</label>
        <div class="control">
          <div class="select">
            <select v-model="selected">
              <option value="wifi">Wi-Fi</option>
              <option value="cafe">Cafe</option>
              <option value="outlet">Outlet</option>
              <option value="fast-wifi">Fast Wi-Fi</option>
              <option value="24/7">24/7</option>
              <option value="quiet">Quiet</option>
              <option value="vegan">Vegan</option>
              <option value="cheap">Cheap</option>
              <option value="gourmet-coffee">Gourmet Coffee</option>
              <option value="confortable-chair">Confortable Chair</option>
              <option value="coworking">Coworking</option>
              <option value="healthy-snack">Healthy Snack</option>
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
          <button
            v-show="isLoading === false"
            id="save-btn"
            class="button is-info"
            @click.prevent="save"
          >
            Save
          </button>
          <button
            v-show="isLoading === true"
            id="save-btn"
            class="button is-info is-loading"
            disabled
          >
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
      placePageUrl: '',
      isLoading: false,
      businessHours: {
        mon: {
          open: '',
          close: '',
          isHoliday: false
        },
        tue: {
          open: '',
          close: '',
          isHoliday: false
        },
        wed: {
          open: '',
          close: '',
          isHoliday: false
        },
        thu: {
          open: '',
          close: '',
          isHoliday: false
        },
        fri: {
          open: '',
          close: '',
          isHoliday: false
        },
        sat: {
          open: '',
          close: '',
          isHoliday: false
        },
        sun: {
          open: '',
          close: '',
          isHoliday: false
        }
      }
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
    console.log(place.businessHours)
    if (place.businessHours !== undefined) {
      Object.keys(this.businessHours).forEach(day => {
        this.businessHours[day] = place.businessHours[day]
      })
    }
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
    async save() {
      this.isLoading = true
      await firestore
        .collection('places')
        .doc(this.placeId)
        .update({
          businessHours: this.businessHours,
          tags: this.tags
        })
      this.isLoading = false
      this.$toast.open({
        message: 'Yes! Successfuly saved 😚',
        type: 'is-success',
        duration: 4000
      })
    },
    deleteTag(index) {
      this.tags.splice(index, 1)
    }
  }
}
</script>

<style lang="scss" scoped>
#go-back {
  display: block;
  margin-bottom: 10px;
}
#save-btn {
  width: 100%;
}
#businesshours-edit {
  margin-bottom: 40px;
  .input {
    width: auto;
  }
  table,
  th,
  td {
    border: none;
  }
}
</style>
