import { vizapi } from "src/boot/axios";
import { useAccountStore } from 'stores/Account';
const piniaAccount = useAccountStore();

export default{
  getCash(){
    let burl = `store/${piniaAccount.join}/cash/getCash`;
    return vizapi.get(burl).then( done => done.data).catch( fail => { return {error:fail.response} });
  }
}

