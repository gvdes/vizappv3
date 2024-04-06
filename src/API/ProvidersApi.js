import { vizapi } from "src/boot/axios";
import { useAccountStore } from 'stores/Account';
const piniaAccount = useAccountStore();

export default{
  index(){
    let burl = `cluster/providers/index`;
    return vizapi.get(burl).then( done => done.data ).catch( fail => { return {error:fail.response} });
  },
  create(data){
    let burl = `cluster/providers/create`;
    return vizapi.post(burl, data).then( done => done.data ).catch( fail => { return {error:fail.response} });
  },
  update(data){
    let burl = `cluster/providers/update`;
    return vizapi.post(burl, data).then( done => done.data ).catch( fail => { return {error:fail.response} });
  }
}
