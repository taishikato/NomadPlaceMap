<template>
  <div class="layout-container">
    <h1 class="title">
      <n-link to="/">
        HangoutMap
      </n-link>
    </h1>
    <div class="cp_ipselect cp_sl04">
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
  border-radius: 7px;
  color: hsl(348, 100%, 61%);
  box-shadow: 0 0px 20px rgba(0, 0, 0, 0.2);
}
input {
  position: absolute;
  top: 10px;
  left: 300px;
  z-index: 200;
  padding: 15px;
  border-radius: 7px;
  border: 0;
  box-shadow: 0 0px 20px rgba(0, 0, 0, 0.2);
}

.cp_ipselect {
  position: absolute;
  top: 10px;
  left: 300px;
  z-index: 200;
  box-shadow: 0 0px 20px rgba(0, 0, 0, 0.2);
}

.cp_ipselect {
  overflow: hidden;
  width: 300px;
  text-align: center;
}
.cp_ipselect select {
  padding: 0 20px;
  height: 50px;
  font-size: 20px;
  width: 100%;
  padding-right: 1em;
  cursor: pointer;
  text-indent: 0.01px;
  text-overflow: ellipsis;
  border: none;
  outline: none;
  background: transparent;
  background-image: none;
  box-shadow: none;
  -webkit-appearance: none;
  appearance: none;
}
.cp_ipselect select::-ms-expand {
  display: none;
}
.cp_ipselect.cp_sl04 {
  position: relative;
  border-radius: 2px;
  border: 0;
  border-radius: 7px;
  background: #ffffff;
}
.cp_ipselect.cp_sl04::before {
  position: absolute;
  top: 0.8em;
  right: 0.8em;
  width: 0;
  height: 0;
  padding: 0;
  content: '';
  border-left: 6px solid transparent;
  border-right: 6px solid transparent;
  pointer-events: none;
}
.cp_ipselect.cp_sl04 select {
  padding: 8px 38px 8px 8px;
  color: #7a7a7a;
}
</style>
