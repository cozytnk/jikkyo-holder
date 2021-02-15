
import Vue from 'vue'
// import { createApp } from 'vue'
import App from './App.vue'
import Item from './Item.vue'


const getCurrentTab = () => {
  return new Promise((resolve, reject) => {
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => resolve(tabs[0]))
  })
}

const getStoredItems = () => {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get([ 'items' ], result => resolve(result.items || []))
  })
}
const setItems = items => {
  return new Promise((resolve, reject) => {
    chrome.storage.local.set({ items }, () => resolve())
  })
}


const getContentInfo = () => {
  return new Promise(resolve => {
    chrome.tabs.executeScript(null, {
      // code: `{a:90,s:56}` ng
      // code: `[12,23]` ok
      // code: `[ location, document ]` ng
      // code: `[ location.href, location.host ]` ok
      code: `[
        location.href,
        document.querySelector('.Link.SeriesBreadcrumbs-title')?.href,
        document.querySelector('.Link.SeriesBreadcrumbs-title')?.innerText,
        document.querySelector('.VideoTitle')?.innerText,
        document.querySelector('.Thumbnail.VideoDescriptionSeriesContainer-seriesThumbnail').style.backgroundImage,
      ]`
    }, result => {
      let [
        url,
        seriesUrl,
        seriesTitle,
        title,
        thumbnail,
      ] = result?.[0] || []
      console.debug(thumbnail)
      thumbnail = thumbnail?.match(/url\("(?<url>.+)"\)/)?.groups.url
      resolve({ url, seriesUrl, seriesTitle, title, thumbnail })
    })
  })
}

const open = (href) => {
  return new Promise(resolve => {
    chrome.tabs.executeScript(null, {
      code: `location.href = href`, // open in new tab ?
      // code: `window.open(href, '_bank')`, // open in new tab
    }, result => resolve(result))
  })
}



Vue.component('item', Item)

const app = new Vue({
  el: '#app',
  data () {
    return {
      items: {},
      currentContentInfo: {},
    }
  },
  render (createElement) {
    return createElement(App, {
      props: { items: this.items, currentContentInfo: this.currentContentInfo },
      on: {
        update: async (item) => {
          console.log('TODO:')
          console.log(item)
          console.log(this)
          item.url = this.currentContentInfo.url
          item.title = this.currentContentInfo.title
          await setItems(this.items)
          await reset()
        },
        remove: async (item) => {
          const i = this.items.findIndex(_item => _item.seriesUrl === item.seriesUrl)
          this.items.splice(i, 1)
          await setItems(this.items)
          await reset()
        },
        clear: async () => {
          chrome.storage.local.clear() // TODO: await
          alert('cleared all items.')
          await reset()
        },
      },
    })
  },
})

const reset = async () => {

  const items = await getStoredItems()
  const currentContentInfo = await getContentInfo()

  const i = items.findIndex(item => item.seriesUrl === currentContentInfo.seriesUrl)
  if (i < 0) {
    const newItem = {
      seriesUrl: currentContentInfo.seriesUrl,
      seriesTitle: currentContentInfo.seriesTitle,
      thumbnail: currentContentInfo.thumbnail,
    }
    items.splice(1, 0, newItem)
  } else {
  }

  Vue.set(app, 'items', items)
  Vue.set(app, 'currentContentInfo', currentContentInfo)

}

window.onload = async () => {

  reset()

  window.app = app // for debug
}