<template>
  <section class="container">
    <div id="map"></div>
    {{ lngLat }}
  </section>
</template>

<script>
/* eslint-disable no-console,no-unused-vars */
import mapboxgl from 'mapbox-gl/dist/mapbox-gl.js'
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder'

export default {
  data() {
    return {
      lngLat: ''
    }
  },
  mounted() {
    mapboxgl.accessToken =
      'pk.eyJ1IjoidGFpc2hpa2F0byIsImEiOiJjanc3NjhqcmYwcm84NGFsdzd2cHFsNmgwIn0.SklNRiivq2gBY3i4xkRuqw'
    const map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/taishikato/cjw7695834ftb1coxuvan7wfb',
      center: [-123.116226, 49.246292],
      zoom: 12
    })
    map.on('click', e => {
      const lngLat = JSON.stringify(e.lngLat)
      this.lngLat = lngLat
    })
    const marker = new mapboxgl.Marker() // initialize a new marker
      .setLngLat([-123.116226, 49.246292]) // Marker [lng, lat] coordinates
      .addTo(map) // Add the marker to the map
    const geocoder = new MapboxGeocoder({
      accessToken: mapboxgl.accessToken, // Set the access token
      mapboxgl: mapboxgl, // Set the mapbox-gl instance
      marker: false, // Do not use the default marker style
      placeholder: 'Search for places in Berkeley',
      proximity: {
        longitude: -123.116226,
        latitude: 49.246292
      },
      limit: 10
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
        console.log(e)
        map.getSource('single-point').setData(e.result.geometry)
      })
    })
  }
}
</script>

<style>
body {
  margin: 0;
  padding: 0;
}
#map {
  /* width: 600px;
  height: 500px; */
  position: absolute;
  top: 0;
  bottom: 0;
  width: 100%;
}
</style>
