import { defineStore } from 'pinia'

export const useWarehouseStore = defineStore('warehouse', {
  state: () => ({
    warehouse:null,
    location:null,
    sections:null
  }),

  getters: {
    doubleCount (state) {
      return state.counter * 2
    }
  },

  actions: {
    setWarehouse (data) { this.warehouse = data; },
    setLocation (data) { this.location = data; },
    setSections (data) { this.sections = data; }
  }
})
