import { defineStore } from 'pinia';
import { LocalStorage } from 'quasar'
import { vizapi } from "src/boot/axios";

export const useAccountStore = defineStore('account', {
  state: () => ({
    account: undefined,
    rol:undefined,
    stores: undefined,
    modules: undefined,
    permissions: undefined,
    join: undefined,
    token: undefined,
    module: undefined
  }),

  getters: {
    lg(){ //letter gender
      let letters = { M:"o", F:"a", I:"e" };
      return this.account ? letters[this.account.gender] : letters[I];
    },// letter gender
    joinedStore(){ return (this.account&&this.stores) ? this.stores.find( s => this.join == s.id ) : null; },
    std_modules() { return this.modules ? this.modules.filter( m => m._module<10000) : [] },
    esp_modules() { return this.modules ? this.modules.filter( m => m._module>=10000) : [] },
    unjoinStores(){ return this.stores ? this.stores.filter( s => s.id!=this.join ) : [];},
    submodulesOf(){ return id => { return this.modules ? this.modules.filter( m => m.module.root==id ) : [] } },
    aim(){ return moduleid => { return this.permissions ? this.permissions.find( a => a._module==moduleid ) : null } },// retorna el permiso correspondiente al modulo en busqueda
    avatar(){ return this.account.avatar ? `src/assets/avatares/${this.account.avatar}` : "src/assets/avatares/flat8.png"; },
    verified(){ return (this.account.email_confirm&&this.account.phone_confirm) ?? false }
  },

  actions: {
    init (acc, token) {
      let {rol,stores,modules, ...account} = acc;
      this.account = account;
      this.rol = acc.rol;
      this.stores = acc.stores;
      this.modules = acc.modules;
      this.setToken(token);
      this.pinup();
    },

    fillLS(als){
      this.account = als.account;
      this.rol = als.rol;
      this.stores = als.stores;
      this.modules = als.modules;
      this.setJoin(als.join);
      this.setToken(als.token);
      this.pinup();
    },

    fresh(acc=null,join=null,token=null){
      if(acc){
        let {rol,stores,modules, ...account} = acc;
        this.account = account;
        this.rol = acc.rol;
        this.stores = acc.stores;
        this.modules = acc.modules;
      }
      join ? this.setJoin(join) : null;
      token ? this.setToken(token) : null;
      this.pinup();
    },

    setToken(data){
      this.token = data;
      vizapi.defaults.headers.common['Authorization'] = `Bearer ${data}`;
    },

    setJoin(data){ this.join = data; },

    pinup(){ LocalStorage.set("account", this.$state); },
  }
})
