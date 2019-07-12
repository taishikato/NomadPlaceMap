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
              Crowdsourced map for digital nomads to find a good place to work
              in the city
            </p>
          </h2>
          <ul id="medium-text" class="has-text-left">
            <li class="is-size-5">
              ☕Are you looking for a cafe with Wi-Fi and vegan menu to work??
            </li>
            <li class="is-size-5">
              📖Are you looking for a quite place to study??
            </li>
            <li class="is-size-4">
              👉NomadPlaceMap is the right place to come
            </li>
          </ul>
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

<style lang="scss" scoped>
#medium-text {
  max-width: 600px;
  margin: 0 auto;
}
</style>
