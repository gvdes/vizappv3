import { defineStore } from 'pinia';
import { LocalStorage } from 'quasar'
import { vizapi } from "src/boot/axios";

export const useAccountStore = defineStore('account', {
  state: () => ({
    account: undefined,
    join: undefined,
    token: undefined,
    stores: undefined,
    modauths: undefined,
    module: undefined,
    clumdlname: "",
    apps: undefined
  }),

  getters: {
    lg(){ //letter gender
      let letters = { M:"o", F:"a", I:"e" };
      return this.account ? letters[this.account.gender] : letters[I];
    },// letter gender
    rol(){ return this.account.rol },
    joinedStore(){ return (this.account&&this.stores) ? this.stores.find( s => this.join == s.id ) : null; },
    unjoinStores(){ return this.stores ? this.stores.filter( s => s.id!=this.join ) : [];},
    submodules(){ return id => { return this.modauths.filter( m => m.module.root==id); } },
    aim(){ return moduleid => { return this.permissions ? this.permissions.find( a => a._module==moduleid ) : null } },// retorna el permiso correspondiente al modulo en busqueda
    avatar(){ return this.account.avatar ? `src/assets/avatares/${this.account.avatar}` : "src/assets/avatares/flat8.png"; },
    verified(){ return (this.account.email_confirm&&this.account.phone_confirm) ?? false }
  },

  actions: {

    setToken(data){
      this.token = data;
      vizapi.defaults.headers.common['Authorization'] = `Bearer ${data}`;
    },

    setAccount(data){ this.account=data; },

    setJoin(data){ this.join=data; },

    setStores(data){ this.stores=data; },

    setModAuths(data){ this.modauths=data; },

    // setea el nombre del modulo del cluster (en el AppMainToolbar)
    setCluMdlTitle(data){ this.clumdlname=data; },

    setApps(data){ this.apps=data },

    persist(){ LocalStorage.set("auth", this.$state); },
  }
})
