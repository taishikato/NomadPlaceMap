<template>
  <section class="section">
    <section class="hero has-text-centered">
      <div class="hero-body">
        <div class="container">
          <h1 class="title is-2">
            👩‍💻👨‍💻NomadPlaceMap🗺️☕
          </h1>
          <h2 class="subtitle is-3">
            <p>
              Cloudsourced map for digital nomads to find a good place to work
              in the city
            </p>
          </h2>
          <p>
            Are you looking for a cafe to work??<br />NomadPlaceMap is the right
            place to come
          </p>
        </div>
      </div>
    </section>
    <section class="has-text-centered">
      <h3 class="title is-3">
        Cities
      </h3>
      <div id="cities" class="columns">
        <div class="column">
          <n-link to="/city/vancouver">
            🌳
            <p class="title is-4">Vancouver</p>
          </n-link>
        </div>
        <div class="column">
          <n-link to="/city/sanfrancisco">
            🌁
            <p class="title is-4">San Francisco</p>
          </n-link>
        </div>
      </div>
    </section>
  </section>
</template>

<script>
import twemoji from 'twemoji'

export default {
  name: 'Top',
  mounted() {
    twemoji.parse(document.body)
  }
}
</script>

<style lang="scss" scoped></style>
