import { vizapi } from "src/boot/axios";
import { useAccountStore } from 'stores/Account';
const piniaAccount = useAccountStore();

export default{
  location(loc){
    let burl = `store/${piniaAccount.join}/locator/location/${loc}`;
    return vizapi.get(burl).then( done => done.data ).catch( fail => { return {error:fail.response} });
  },

  product(code){
    let burl = `store/${piniaAccount.join}/locator/product/${code}`;
    return vizapi.get(burl).then( done => done.data ).catch( fail => { return {error:fail.response} });
  },

  toggle(data){
    let burl = `store/${piniaAccount.join}/locator/toggle`;
    return vizapi.post(burl,data).then( done => done.data ).catch( fail => { return {error:fail.response} });
  }
}
