import { vizapi } from "src/boot/axios";
import { useAccountStore } from 'stores/Account';
const piniaAccount = useAccountStore();

export default{
  index(data){
    let burl = `cluster/stores/index?type=${data}`;
    return vizapi.get(burl).then( done => done.data ).catch( fail => { return {error:fail.response} });
  },
  addStore(data){
    let burl = `cluster/stores/addStore`;
    return vizapi.post(burl,data).then( done => done.data ).catch( fail => { return {error:fail.response} });
  },
  updateStore(data){
    let burl = `cluster/stores/updateStore`;
    return vizapi.put(burl,data).then( done => done.data ).catch( fail => { return {error:fail.response} });
  }
}
