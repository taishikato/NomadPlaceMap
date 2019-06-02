<template>
  <div class="layout-container">
    <h1 class="title is-product-color">
      <n-link to="/">
        🚶
      </n-link>
    </h1>

    <nuxt style="z-index: 100;" />

    <nav
      class="navbar is-fixed-bottom"
      role="navigation"
      aria-label="main navigation"
    >
      <div class="navbar-brand">
        <n-link class="navbar-item" to="/">
          🚶
        </n-link>
        <a
          role="button"
          class="navbar-burger burger"
          aria-label="menu"
          aria-expanded="false"
          data-target="navbarBasicExample"
        >
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </a>
      </div>
      <div id="navbarBasicExample" class="navbar-menu">
        <div class="navbar-start">
          <a class="navbar-item">
            Home
          </a>
        </div>
        <div class="navbar-end">
          <div class="navbar-item">
            <a>
              FeedBack
            </a>
          </div>
        </div>
      </div>
    </nav>
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
