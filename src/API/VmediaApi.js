import { vizapi } from "src/boot/axios";
import { useAccountStore } from 'stores/Account';

const piniaAccount = useAccountStore();

export default{
  recycle(file){
    let burl =  "vmedia/archive";
    return vizapi.patch(burl,file).then( done => done.data).catch(fail => { return {error:fail.response} });
  }
}
