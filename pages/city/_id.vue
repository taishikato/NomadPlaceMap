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
      cities: {
        vancouver: {
          name: '🌳Vancouver',
          value: 'vancouver',
          coordinates: {
            latitude: -123.1223953278889,
            longitude: 49.28159210931116
          }
        },
        sanfrancisco: {
          name: '🌁San Francisco',
          value: 'sanfrancisco',
          coordinates: {
            latitude: -122.431297,
            longitude: 37.773972
          }
        },
        newyork: {
          name: '🗽New York',
          value: 'newyork',
          coordinates: {
            latitude: -73.98513,
            longitude: 40.758896
          }
        }
      },
      cityName: '🌳Vancouver',
      isImageModalActive: false,
      showAddingPlaceButton: true,
      addingData: {
        properties: {}
      }
    }
  },
  created() {
    this.requestedCity = this.$route.params.id
    this.cityName = this.cities[this.requestedCity].name
  },
  mounted() {
    const latitude = this.cities[this.requestedCity].coordinates.latitude
    const longitude = this.cities[this.requestedCity].coordinates.longitude
    this.createMap(latitude, longitude)
  },
  methods: {
    createMap(latitude, longitude) {
      mapboxgl.accessToken = this.mapBoxAccessToken
      const map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/taishikato/cjw7695834ftb1coxuvan7wfb',
        center: [latitude, longitude],
        zoom: 12
      })
      map.on('dblclick', e => {
        const lngLat = JSON.stringify(e.lngLat)
        console.log(lngLat)
      })
      const marker = new mapboxgl.Marker() // initialize a new marker
        .setLngLat([latitude, longitude]) // Marker [lng, lat] coordinates
        .addTo(map) // Add the marker to the map
      const geocoder = new MapboxGeocoder({
        accessToken: mapboxgl.accessToken, // Set the access token
        mapboxgl: mapboxgl, // Set the mapbox-gl instance
        marker: false, // Do not use the default marker style
        placeholder: `Search for places in ${this.cityName}`,
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
          map.getSource('single-point').setData(e.result.geometry)
        })
      })
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
  right: 100px;
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
  left: 300px;
  height: 50px;
  select {
    border: 0;
    height: 100%;
    font-weight: 900;
  }
}
</style>
