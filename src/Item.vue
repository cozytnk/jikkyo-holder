<template>
<div class="item" :class="{ current: currentContentInfo }">
  <img class="thumbnail"
    :src="item.thumbnail || `http://placehold.jp/000/ddd/90x60.png?text=NoImage`"
    @click="open(item.seriesUrl)"
    :title="`open ${item.seriesUrl}`"
  >
  <div class="titles">
    <span class="title clickable" :title="`open ${item.url}`" @click="open(item.url)">
      {{ item.title || 'no title' }}
    </span>
    <i class="arrow-down material-icons" v-if="currentContentInfo">keyboard_arrow_down</i>
    <span class="title" v-if="currentContentInfo">
      {{ currentContentInfo.title || 'no title' }}
    </span>
  </div>
  <div class="controls">
    <button title="update" @click="$emit('update', item)" :disabled="!currentContentInfo">
      <i class="material-icons">update</i>
    </button>
    <button title="remove" @click="$emit('remove', item)">
      <i class="material-icons">delete</i>
    </button>
  </div>
</div>
</template>


<script>
export default {
  props: [ 'item', 'currentContentInfo' ],
  data () {
    return {
    }
  },
  methods: {
    open (href) {
      window.open(href, '_bank')
    },
  },
}
</script>


<style scoped>
.item {
  display: grid;
  grid-template:
    "thumbnail titles controls" auto
    /     auto    1fr     auto;
  gap: 6px;
  padding: 6px 12px;
  background-color: #222;
  color: #ddd;
}
.item.current {
  background-color: #000;
}
.thumbnail {
  width: 96px;
  height: 54px;
  border-radius: 4px;
  border: 1px solid #444;
  background-color: #000;
  object-fit: contain;
  cursor: pointer;
}
.titles {
  display: flex;
  flex-direction: column;
  gap: 0;
  justify-content: space-between;
  overflow: auto;
}
.title {
  font-size: 12px;
  margin: auto 0;
}
.arrow-down {
  align-self: center;
  font-size: 14px;
}
.controls {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
.controls > button {
  background-color: transparent;
  border: none;
  color: inherit;
  cursor: pointer;
}
.controls > button:disabled {
  color: rgba(255, 255, 255, 0.33);
  cursor: default;
}
.controls > button > i {
  font-size: 18px;
}

.clickable {
  cursor: pointer;
}
</style>