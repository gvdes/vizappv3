import { vizapi } from "src/boot/axios";
import { useAccountStore } from 'stores/Account';
const piniaAccount = useAccountStore();

export default{
  index(){
    let burl = `cluster/providers/index`;
    return vizapi.get(burl).then( done => done.data ).catch( fail => { return {error:fail.response} });
  }
}
