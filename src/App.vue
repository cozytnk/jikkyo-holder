<template>
<div class="app">
  <!-- <span class="title">jikkyo-holder</span> -->
  <div class="items">
    <item class="item"
      v-for="item in items" :key="item.seriesUrl"
      :item="item"
      :currentContentInfo="item.seriesUrl === currentContentInfo.seriesUrl ? currentContentInfo : null"
      @update="$emit('update', $event)"
      @remove="$emit('remove', $event)"
    />
  </div>
  <div class="footer">
    <button @click="$emit('clear')">clear all</button>
    <button @click="checkStorage">check storage</button>
  </div>
</div>
</template>


<script>
export default {
  props: [ 'items', 'currentContentInfo' ],
  data () {
    return {
    }
  },
  methods: {
    checkStorage () {
      chrome.storage.local.getBytesInUse(null, bytesInUse => alert(`${bytesInUse} bytes in use.`))
      chrome.storage.local.get(null, result => alert(JSON.stringify(result, null, 2)))
    },
  },
}
</script>


<style scoped>
.app {
  display: grid;
  grid-template:
    /* "title " auto */
    "items " auto
    "footer" auto
    /  100%;
}
.title {
  padding: 6px 12px;
  text-align: center;
  font-size: 14px;
  /* font-weight: bold; */
}
.items {
  padding: 6px 0;
  display: flex;
  flex-direction: column;
}
.footer {
  padding: 6px 12px;
}
.footer > button {
  background-color: #ccc;
  font-size: 10px;
  border: none;
  border-radius: 2px;
  cursor: pointer;
}
</style>