import { vizapi } from "src/boot/axios";
import { useAccountStore } from 'stores/Account';
const piniaAccount = useAccountStore();

export default{
  index(){
    let burl = `store/${piniaAccount.join}/warehouses`;
    return vizapi.get(burl).then( done => done.data ).catch( fail => { return {error:fail.response} });
  },

  open(wid){
    let burl = `store/${piniaAccount.join}/warehouses/${wid}`;
    return vizapi.get(burl).then( done => done.data ).catch( fail => { return {error:fail.response} });
  },

  structure(wid){
    let burl = `store/${piniaAccount.join}/warehouses/${wid}/structure`;
    return vizapi.get(burl).then( done => done.data ).catch( fail => { return {error:fail.response} });
  }
}
