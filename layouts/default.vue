<template>
  <div class="layout-container">
    <h1 class="title is-product-color">
      <n-link to="/">
        🚶HangoutMap
      </n-link>
    </h1>

    <nuxt style="z-index: 100;" />
  </div>
</template>

<script>
/* eslint-disable no-console */

import twemoji from 'twemoji'
export default {
  data() {
    return {
      searchQuery: ''
    }
  },
  mounted() {
    twemoji.parse(document.body)
  }
}
</script>

<style lang="scss" scoped>
.title {
  height: 50px;
  font-size: 30px;
  font-weight: bold;
  position: absolute;
  top: 10px;
  left: 50px;
  z-index: 200;
  background-color: white;
  padding: 10px;
  border-radius: 4px;
  background-color: hsl(348, 100%, 61%);
  a {
    font-weight: 900;
    &:hover {
      color: #fff;
    }
  }
}
</style>
