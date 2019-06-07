<template>
  <section>
    <div id="map"></div>

    <div class="select" style="z-index: 200;">
      <select class="nav-menu-enclosure" @change="changeCity($event)">
        <option
          v-for="city in cities"
          :key="city.name"
          :value="city.value"
          :selected="requestedCity === city.value"
        >
          {{ city.name }}
        </option>
      </select>
    </div>

    <a
      v-show="showAddingPlaceButton === true"
      id="add-box-trigger"
      class="button is-product-color is-outlined nav-menu-enclosure"
      @click.prevent="clickAddingPlaceButton"
    >
      Add a place you like
    </a>

    <b-modal :active.sync="isImageModalActive">
      <div id="model-box">
        <h3 class="title">Add This Place??</h3>
        <!-- {{ addingData }} -->
        <div class="field">
          <div class="control">
            <h4 class="title is-4">{{ addingData.text_en }}</h4>
          </div>
        </div>
        <div class="field">
          <div class="control">
            {{ addingData.properties.address }}
          </div>
        </div>
        <div class="field is-grouped">
          <div class="control">
            <a class="button is-primary" @click.prevent="savePlaceData">Add</a>
          </div>
          <div class="control">
            <button class="button is-text" @click="closeModel">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </b-modal>
  </section>
</template>

<script>
/* eslint-disable no-console,no-unused-vars */
import getUnixTime from '~/plugins/getUnixTime'
import asyncForEach from '~/plugins/asyncForEach'

import mapboxgl from 'mapbox-gl/dist/mapbox-gl.js'
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder'
import uuid from 'uuid/v4'

import firebase from '~/plugins/firebase'
// Use firestore
import 'firebase/firestore'
const firestore = firebase.firestore()

export default {
  name: 'CityId',
  data() {
    return {
      requestedCity: 'vancouver',
      mapBoxAccessToken:
        'pk.eyJ1IjoidGFpc2hpa2F0byIsImEiOiJjanc3NjhqcmYwcm84NGFsdzd2cHFsNmgwIn0.SklNRiivq2gBY3i4xkRuqw',
      cityName: '🌳Vancouver',
      isImageModalActive: false,
      showAddingPlaceButton: true,
      addingData: {
        properties: {}
      },
      marks: [],
      cities: {
        vancouver: {
          name: '🌳Vancouver',
          value: 'vancouver',
          coordinates: {
            latitude: -123.1223953278889,
            longitude: 49.28159210931116
          },
          bbox: [
            -124.73377190858307,
            48.431278295951216,
            -122.03503339171422,
            50.264092205061246
          ]
        },
        sanfrancisco: {
          name: '🌁San Francisco',
          value: 'sanfrancisco',
          coordinates: {
            latitude: -122.431297,
            longitude: 37.773972
          },
          bbox: [
            -123.30585393709464,
            37.12022901968248,
            -121.6850324171728,
            38.32014665909986
          ]
        },
        newyork: {
          name: '🗽New York',
          value: 'newyork',
          coordinates: {
            latitude: -73.98513,
            longitude: 40.758896
          },
          bbox: [
            -74.46734390200874,
            40.59756976679208,
            -73.5776787636901,
            41.07067932385931
          ]
        }
      }
    }
  },
  created() {
    this.requestedCity = this.$route.params.id
    this.cityName = this.cities[this.requestedCity].name
  },
  async mounted() {
    const latitude = this.cities[this.requestedCity].coordinates.latitude
    const longitude = this.cities[this.requestedCity].coordinates.longitude
    const map = this.createMap(latitude, longitude)

    // Get data from Firestore to add marks
    const placeData = await firestore.collection('places').get()
    await asyncForEach(placeData.docs, doc => {
      this.marks.push(doc.data())
    })
    this.marks.forEach(marker => {
      this.addMarks(map, marker)
    })
  },
  methods: {
    createMap(latitude, longitude) {
      mapboxgl.accessToken = this.mapBoxAccessToken
      const map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/taishikato/cjw7695834ftb1coxuvan7wfb',
        center: [latitude, longitude],
        zoom: 11
      })
      map.on('dblclick', e => {
        const lngLat = JSON.stringify(e.lngLat)
        console.log(lngLat)
      })
      const geocoder = new MapboxGeocoder({
        accessToken: mapboxgl.accessToken, // Set the access token
        mapboxgl: mapboxgl, // Set the mapbox-gl instance
        marker: false, // Do not use the default marker style
        placeholder: `Search for places in ${this.cityName}`,
        bbox: this.cities[this.requestedCity].bbox,
        proximity: {
          latitude,
          longitude
        },
        limit: 10,
        language: 'en'
      })
      map.addControl(geocoder)

      map.on('load', () => {
        map.addSource('single-point', {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: []
          }
        })

        map.addLayer({
          id: 'point',
          source: 'single-point',
          type: 'circle',
          paint: {
            'circle-radius': 10,
            'circle-color': '#448ee4'
          }
        })

        // Listen for the `result` event from the Geocoder
        // `result` event is triggered when a user makes a selection
        //  Add a marker at the result's coordinates
        geocoder.on('result', e => {
          this.isImageModalActive = true
          this.addingData = e.result
          console.log(e)
          map.getSource('single-point').setData(e.result.geometry)
        })
      })
      return map
    },
    closeModel() {
      this.isImageModalActive = false
    },
    clickAddingPlaceButton() {
      this.showAddingPlaceButton = false
      document.getElementsByClassName(
        'mapboxgl-ctrl-top-right'
      )[0].style.display = 'block'
    },
    changeCity(event) {
      this.cityName = this.cities[event.target.value].name
      this.$router.push(`./${event.target.value}`)
    },
    async savePlaceData() {
      const id = uuid()
        .split('-')
        .join('')
      await this.saveOnFirestore(id, {
        id,
        name: this.addingData.text_en,
        address: this.addingData.properties.address,
        coordinates: {
          latitude: this.addingData.geometry.coordinates[0],
          longitude: this.addingData.geometry.coordinates[1]
        }
      })
      this.$toast.open({
        message: 'Yes! Successfuly saved this place 😚',
        type: 'is-success',
        duration: 3000
      })
      this.closeModel()
    },
    async saveOnFirestore(id, data) {
      const created = getUnixTime()
      await firestore
        .collection('places')
        .doc(id)
        .set(data)
    },
    addMarks(map, marker) {
      new mapboxgl.Marker()
        .setLngLat([marker.coordinates.latitude, marker.coordinates.longitude])
        .setPopup(
          new mapboxgl.Popup({ offset: 25 }).setHTML(
            `<h3 class="title is-5">${marker.name}</h3>
            <p><a href="../place/${marker.id}">Detail</a></p>
            <p>100 Likes</p>
            `
          )
        )
        .addTo(map)
    }
  }
}
</script>

<style scoped lang="scss">
body {
  margin: 0;
  padding: 0;
}

.is-outlined {
  background-color: white;
}

#map {
  /* width: 600px;
  height: 500px; */
  position: absolute;
  top: 0;
  bottom: 0;
  width: 100%;
}
.container {
  height: 100%;
}

#add-box-trigger {
  position: absolute;
  top: 10px;
  right: 50px;
  z-index: 200;
  height: 50px;
  font-weight: 900;
}

#model-box {
  padding: 10px;
  border-radius: 7px;
  background-color: white;
}

.select {
  position: absolute;
  top: 10px;
  left: 130px;
  height: 50px;
  select {
    border: 0;
    height: 100%;
    font-weight: 900;
  }
}
</style>
