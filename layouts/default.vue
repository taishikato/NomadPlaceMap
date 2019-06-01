<template>
  <div class="layout-container">
    <h1 class="title">
      <n-link to="/">
        HangoutMap
      </n-link>
    </h1>
    <div class="select" style="z-index: 200;">
      <select>
        <option v-for="city in cities" :key="city.name" :value="city.name">
          {{ city.name }}
        </option>
      </select>
    </div>

    <nuxt style="z-index: 100;" />
  </div>
</template>

<script>
/* eslint-disable no-console */
export default {
  data() {
    return {
      searchQuery: '',
      cities: [{ name: 'Vancouver' }, { name: 'San Fransisco' }]
    }
  }
}
</script>

<style lang="scss" scoped>
.title {
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
  box-shadow: 0 0px 20px rgba(0, 0, 0, 0.2);
  a {
    color: white;
  }
}
.select {
  position: absolute;
  top: 10px;
  left: 300px;
  height: 50px;
  box-shadow: 0 0px 20px rgba(0, 0, 0, 0.2);
  select {
    border: 0;
  }
}
</style>
