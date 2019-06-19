<template>
  <section>
    <div id="map"></div>

    <div id="top-nav">
      <div id="city-select" class="select">
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

      <div id="tag-filter-select" class="select">
        <select class="nav-menu-enclosure" @change="changeFilter($event)">
          <option value="">Tag Filter</option>
          <option value="wifi">Wi-Fi</option>
          <option value="cafe">Cafe</option>
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

      <a
        v-show="showAddingPlaceButton === true"
        id="add-box-trigger"
        class="button is-product-color is-outlined nav-menu-enclosure"
        @click.prevent="clickAddingPlaceButton"
      >
        Add a place you like
      </a>
    </div>

    <b-modal :active.sync="isModalActive">
      <div id="model-box" class="loginBtn has-text-centered">
        <h3 class="title">Join NomadPlaceMap</h3>
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

    <b-modal :active.sync="isImageModalActive">
      <div id="model-box add-place-box">
        <h3 class="title has-text-centered" style="color: white;">
          Add This Place??
        </h3>
        <div
          style="background-color: white; border-radius: 3px; padding: 5px; border: 2px solid #e8e0e0"
        >
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
              <a class="button is-primary" @click.prevent="savePlaceData"
                >Add
              </a>
            </div>
            <div class="control">
              <button class="button is-text" @click="closeModel">
                Cancel
              </button>
            </div>
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

const googleProvider = new firebase.auth.GoogleAuthProvider()
const facebookProvider = new firebase.auth.FacebookAuthProvider()
const twitterProvider = new firebase.auth.TwitterAuthProvider()

export default {
  name: 'CityId',
  middleware: ['setLoginUser'],
  data() {
    return {
      isModalActive: false,
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
      places: [],
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
        }
        // newyork: {
        //   name: '🗽New York',
        //   value: 'newyork',
        //   coordinates: {
        //     latitude: -73.98513,
        //     longitude: 40.758896
        //   },
        //   bbox: [
        //     -74.46734390200874,
        //     40.59756976679208,
        //     -73.5776787636901,
        //     41.07067932385931
        //   ]
        // }
      }
    }
  },
  created() {
    this.requestedCity = this.$route.params.id
    if (this.cities[this.requestedCity] === undefined) {
      const error = new Error()
      error.message = `We can't find the city named ${this.requestedCity}`
      error.statusCode = 404
      throw error
    }
    this.cityName = this.cities[this.requestedCity].name
  },
  async mounted() {
    if (this.cities[this.requestedCity] === undefined) {
      const error = new Error()
      error.message = `We can't find the city named ${this.requestedCity}`
      error.statusCode = 404
      throw error
    }
    const latitude = this.cities[this.requestedCity].coordinates.latitude
    const longitude = this.cities[this.requestedCity].coordinates.longitude
    const map = this.createMap(latitude, longitude)
    // Get data from Firestore to add marks
    const places = await firestore
      .collection('places')
      .where('city', '==', this.requestedCity)
      .get()
    await asyncForEach(places.docs, doc => {
      this.marks.push(doc.data())
      this.places.push(doc.data())
    })
    this.marks.forEach(marker => {
      this.addMarks(map, marker)
    })

    // Check GPS
    const options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
    }
    const success = pos => {
      const crd = pos.coords
    }
    function error(err) {
      console.warn(`ERROR(${err.code}): ${err.message}`)
      // User denied Geolocation
      if (err.code === 1) {
        alert(
          'Location information is unavailable. Please check your browser setting and make sure it can uses GPS to get youer curent position.'
        )
      }
    }
    navigator.geolocation.getCurrentPosition(success, error, options)
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
    createMap(latitude, longitude) {
      mapboxgl.accessToken = this.mapBoxAccessToken
      const map = new mapboxgl.Map({
        container: 'map',
        // style: 'mapbox://styles/taishikato/cjw7695834ftb1coxuvan7wfb',
        style: 'mapbox://styles/taishikato/cjw88gplb5f251cmncnerger7',
        center: [latitude, longitude],
        zoom: 11
      })
      // Add geolocate control to the map.
      map.addControl(
        new mapboxgl.GeolocateControl({
          positionOptions: {
            enableHighAccuracy: true
          },
          trackUserLocation: true
        })
      )

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

        // Listen for the `result` event from the Geocoder
        // `result` event is triggered when a user makes a selection
        //  Add a marker at the result's coordinates
        geocoder.on('result', e => {
          this.isImageModalActive = true
          this.addingData = e.result
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
        'mapboxgl-ctrl-geocoder'
      )[0].style.display = 'block'
    },
    changeCity(event) {
      this.cityName = this.cities[event.target.value].name
      this.$router.push(`./${event.target.value}`)
    },
    async changeFilter(event) {
      if (this.$store.getters.getLoginStatus === false) {
        this.$router.push(`/login?path=/city/${this.requestedCity}`)
        return
      }
      this.marks = []
      const map = this.createMap(-123.1223953278889, 49.28159210931116)
      let placeData
      if (event.target.value === '') {
        // Reset tag filter
        placeData = this.places
      } else {
        // Get data from Firestore to add marks
        placeData = this.places.filter(
          place =>
            place.tags !== undefined &&
            place.tags.indexOf(event.target.value) >= 0
        )
      }
      await asyncForEach(placeData, doc => {
        this.marks.push(doc)
      })
      this.marks.forEach(marker => {
        this.addMarks(map, marker)
      })
    },
    async savePlaceData() {
      const id = uuid()
        .split('-')
        .join('')
      await this.saveOnFirestore(id, {
        id,
        name: this.addingData.text_en,
        address: this.addingData.properties.address || '',
        coordinates: {
          latitude: this.addingData.geometry.coordinates[0],
          longitude: this.addingData.geometry.coordinates[1]
        },
        city: this.requestedCity
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
    async addMarks(map, marker) {
      const res = await firestore
        .collection('places')
        .doc(marker.id)
        .collection('likes')
        .get()
      let popUpContent = `
      <h3 class="title is-6">${marker.name}</h3>
      <p class="subtitle is-7">${marker.address || ''}</p>
      <p><a href="../place/${marker.id}">Detail</a></p>
      `
      if (res.size !== 0) {
        popUpContent += `<p>${res.size} Likes</p>`
      }
      const doc = new DOMParser().parseFromString(
        `<?xml version="1.0" encoding="utf-8"?>
<!-- Generator: Adobe Illustrator 20.0.0, SVG Export Plug-In . SVG Version: 6.00 Build 0)  -->
<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
	 viewBox="0 0 30 30" style="enable-background:new 0 0 30 30;" xml:space="preserve">
<g id="XMLID_2_">
	<g>
		<path style="fill:#0F86BD;" d="M15,28.9c-1.6-3-8-9.4-9.9-13.5c-0.6-1.3-1-2.7-1-4.2C4.2,5.7,9.1,1.1,15,1.1s10.9,4.6,10.9,10.1
			c0,1.5-0.4,2.9-1,4.2l0,0C23,19.5,16.6,25.9,15,28.9L15,28.9z"/>
	</g>
	<g>
		<path style="fill:none;stroke:#87C2DE;stroke-width:2;stroke-linecap:round;stroke-miterlimit:10;" d="M5.1,15.4
			c-0.6-1.3-1-2.7-1-4.2C4.2,5.7,9.1,1.1,15,1.1s10.9,4.6,10.9,10.1c0,1.5-0.4,2.9-1,4.2"/>
		
			<line style="fill:none;stroke:#87C2DE;stroke-width:2;stroke-linecap:round;stroke-miterlimit:10;" x1="15.1" y1="28.9" x2="15.1" y2="28.9"/>
		<path style="fill:none;stroke:#87C2DE;stroke-width:2;stroke-linecap:round;stroke-miterlimit:10;" d="M5.1,15.4
			c1.9,4.1,8.3,10.5,9.9,13.5"/>
		<path style="fill:none;stroke:#87C2DE;stroke-width:2;stroke-linecap:round;stroke-miterlimit:10;" d="M24.9,15.4
			c-1.9,4.1-8.3,10.5-9.9,13.5h0v0"/>
	</g>
</g>
</svg>
`,
        'application/xml'
      )
      const el = document.createElement('div')
      el.appendChild(el.ownerDocument.importNode(doc.documentElement, true))
      // const el = document.createElement('div').innerHTML =
      el.className = 'marker-normal'
      if (res.size >= 5) {
        el.className = 'marker-popular'
      }
      new mapboxgl.Marker(el)
        .setLngLat([marker.coordinates.latitude, marker.coordinates.longitude])
        .setPopup(new mapboxgl.Popup({ offset: 25 }).setHTML(popUpContent))
        .addTo(map)
    }
  }
}
</script>

<style scoped lang="scss">
$sp: 767px;
@mixin sp {
  @media (max-width: ($sp)) {
    @content;
  }
}

body {
  margin: 0;
  padding: 0;
}

#top-nav {
  position: relative;
  top: 60px;
  width: 100%;
  height: 50px;
  margin-top: -40px;
  > div,
  a {
    height: 50px;
    position: absolute;
  }
  #city-select {
    left: 50px;
    @include sp {
      left: 30px;
    }
  }
  #tag-filter-select {
    left: 270px;
    @include sp {
      left: 220px;
    }
  }
  #add-box-trigger {
    font-weight: 900;
    right: 50px;
    @include sp {
      top: 60px;
      left: 50px;
    }
  }
}

.is-outlined {
  background-color: white;
}

#map {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 100%;
}
.container {
  height: 100%;
}

.select {
  select {
    border: 0;
    height: 100%;
    font-weight: 900;
  }
}
</style>
