<template>
  <section class="hero">
    <div class="hero-body has-text-centered">
      <div class="container">
        <h1 class="title">
          <span v-show="statusCode === 404">4🙄4</span>
          <span v-show="statusCode !== 404">{{ statusCode }}</span>
        </h1>
        <h2 class="subtitle">
          {{ message }}
        </h2>
      </div>
    </div>
  </section>
</template>

<script>
/* eslint-disable no-console */

import twemoji from 'twemoji'

export default {
  props: {
    error: {
      type: Object,
      default: new Error(),
      required: true
    }
  },
  computed: {
    statusCode() {
      return (this.error && this.error.statusCode) || 500
    },
    message() {
      return this.error.message || `<%= messages.client_error %>`
    }
  },
  mounted() {
    twemoji.parse(document.body)
  }
}
</script>
