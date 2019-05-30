<template>
  <section class="container">
    <div id="map"></div>
    {{ lngLat }}
  </section>
</template>

<script>
import mapboxgl from 'mapbox-gl/dist/mapbox-gl.js'

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
      zoom: 10.7
    })
    map.on('click', e => {
      const lngLat = JSON.stringify(e.lngLat)
      this.lngLat = lngLat
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
  width: 600px;
  height: 500px;
  /* position: absolute;
  top: 0;
  bottom: 0;
  width: 100%; */
}
</style>
