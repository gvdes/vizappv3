import { vizapi } from "src/boot/axios";
import { useAccountStore } from 'stores/Account';
const piniaAccount = useAccountStore();

export default{
  getCash(){
    let burl = `store/${piniaAccount.join}/cash/getCash`;
    return vizapi.get(burl).then( done => done.data).catch( fail => { return {error:fail.response} });
  },
  openCash(data){
    let burl = `store/${piniaAccount.join}/cash/OpenCash`;
    return vizapi.post(burl,data).then( done => done.data).catch( fail => { return {error:fail.response} });
  },
  closeBox(data){
    let burl = `store/${piniaAccount.join}/cash/closeBox`;
    return vizapi.post(burl,data).then( done => done.data).catch( fail => { return {error:fail.response} });
  }
}

