import { defineStore } from 'pinia'

export const useMediaStore = defineStore('media', {
  state: () => ({
    disks:{
      "mmedia":"http://192.168.12.183/kraken/public/multimedia/"
    },
    audio:[]
  }),

  getters: {
    // defaultcover (state) { return state.disks.covers+"/8533be05-6e9b-40f1-8e5f-a9c4cd7a0b67.png" }
  },

  actions: {
    increment () {
      this.counter++
    }
  }
})
