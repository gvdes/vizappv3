import { vizapi } from "src/boot/axios";
import { useAccountStore } from 'stores/Account';
const piniaAccount = useAccountStore();

export default{
  atc(key,warehouse,locations,prices,media){
    console.log("Buscando:", {"Clave":key,"Almacenes":warehouse,"Ubicaciones":locations,"Precios":prices,"Multimedia":media});
    let burl = `/pfinder/${piniaAccount.join}?key=${key}&warehouse=${warehouse}&locations=${locations}&prices=${prices}&media=${media}`;
    return vizapi.get(burl).then( done => done.data ).catch( fail => { return {error:fail.response} });
  },

  std(){

  }
}
