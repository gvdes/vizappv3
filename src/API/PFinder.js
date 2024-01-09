import { vizapi } from "src/boot/axios";
import { useAccountStore } from 'stores/Account';
const piniaAccount = useAccountStore();

export default{
  search(params){
    let burl = `/pfinder/${piniaAccount.join}?${params}`;
    console.log("Buscando:", burl);
    return vizapi.get(burl).then( done => done.data ).catch( fail => { return {error:fail.response} });
  }
}
