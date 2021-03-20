chrome.myutls = {

  getStoredItems: () => {
    return new Promise((resolve, reject) => {
      chrome.storage.local.get([ 'items' ], result => resolve(result.items || []))
    })
  },

  setItems: items => {
    return new Promise((resolve, reject) => {
      chrome.storage.local.set({ items }, resolve)
    })
  },

  clearItems: () => {
    return new Promise((resolve, reject) => {
      chrome.storage.local.clear(resolve)
    })
  },

  getContentInfo: () => {
    return new Promise(resolve => {
      chrome.tabs.executeScript(null, {
        // code: `{a:90,s:56}` ng
        // code: `[12,23]` ok
        // code: `[ location, document ]` ng
        // code: `[ location.href, location.host ]` ok
        code: `[
          location.href,
          document.querySelector('.VideoTitle')?.innerText,
          document.querySelector('.Link.SeriesBreadcrumbs-title')?.href,
          document.querySelector('.Link.SeriesBreadcrumbs-title')?.innerText,
          // document.querySelector('.Thumbnail.VideoDescriptionSeriesContainer-seriesThumbnail')?.style?.backgroundImage?.match(/url\("(.+)"\)/)?.[1],
          document.querySelector('.Thumbnail.VideoDescriptionSeriesContainer-seriesThumbnail')?.style?.backgroundImage,
        ]`
      }, result => {
        const [
          url,
          title,
          seriesUrl,
          seriesTitle,
          // thumbnail,
          thumbnailUrlString,
        ] = result?.[0] || []
        console.debug(result)
        // const id = url?.match(/https:\/\/www\.nicovideo\.jp\/watch\/(sm\d+)/)?.[1]
        // const seriesId = seriesUrl.match(/https:\/\/www\.nicovideo\.jp\/series\/(\d+)/)?.[1]
        const thumbnail = thumbnailUrlString?.match(/url\("(.+)"\)/)?.[1]
        resolve({ url, seriesUrl, seriesTitle, title, thumbnail })
      })
    })
  },

}


import Vue from 'vue'
import App from './App.vue'
import Item from './Item.vue'
Vue.component('item', Item)

const app = new Vue({
  el: '#app',
  data () {
    return {
      items: [],
      currentContentInfo: {},
    }
  },
  methods: {
    async reset () {
      const items = await chrome.myutls.getStoredItems()
      const currentContentInfo = await chrome.myutls.getContentInfo()

      const i = items.findIndex(item => item.seriesUrl === currentContentInfo.seriesUrl)
      if (i < 0) {
        const newItem = {
          seriesUrl: currentContentInfo.seriesUrl,
          seriesTitle: currentContentInfo.seriesTitle,
          thumbnail: currentContentInfo.thumbnail,
        }
        items.splice(0, 0, newItem)
      } else {
        // 現在ページの内容を更新・最上段に表示
        const [ currentItem ] = items.splice(i, 1)
        currentItem.thumbnail = currentContentInfo.thumbnail || currentItem.thumbnail
        items.splice(0, 0, currentItem)
      }

      this.items = items
      this.currentContentInfo = currentContentInfo
    },
    async update (item) {
      console.log(`@app.update`, item)
      item.url = this.currentContentInfo.url
      item.title = this.currentContentInfo.title
      await chrome.myutls.setItems(this.items)
      await this.reset()
    },
    async remove (item) {
      console.log(`@app.remove`, item)
      const i = this.items.findIndex(_item => _item.seriesUrl === item.seriesUrl)
      this.items.splice(i, 1)
      await chrome.myutls.setItems(this.items)
      await this.reset()
    },
    async clear () {
      console.log(`@app.clear`)
      if (confirm(`clear all items`)) {
        await chrome.myutls.clearItems()
        await this.reset()
      }
    },
  },
  render (createElement) {
    return createElement(App, {
      props: {
        items: this.items,
        currentContentInfo: this.currentContentInfo,
      },
      on: {
        update: this.update,
        remove: this.remove,
        clear: this.clear,
      },
    })
  },
})


window.onload = async () => {

  await app.reset()
  window.app = app // for debug
}