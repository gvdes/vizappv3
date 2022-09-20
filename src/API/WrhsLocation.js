import { vizapi } from "src/boot/axios";
import { useAccountStore } from 'stores/Account';
const piniaAccount = useAccountStore();

export default{
  open(wid,lid){
    let burl = `store/${piniaAccount.join}/warehouses/${wid}/section/${lid}`;
    return vizapi.get(burl).then( done => done.data ).catch( fail => { return {error:fail.response} });
  },

  structure(wid,lid){
    let burl = `store/${piniaAccount.join}/warehouses/${wid}/section/${lid}/structure`;
    return vizapi.get(burl).then( done => done.data ).catch( fail => { return {error:fail.response} });
  }
}
