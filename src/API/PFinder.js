import { vizapi } from "src/boot/axios";
import { useAccountStore } from 'stores/Account';
const piniaAcount = useAccountStore();

export default{
  atc(key,warehouse,locations,prices){
    let burl = `/pfinder/${piniaAcount.join}?key=${key}&warehouse=${warehouse}&locations=${locations}&prices=${prices}`;
    return vizapi.get(burl).then( done => done.data ).catch( fail => { return {error:fail.response} });
  },

  std(){

  }
}
