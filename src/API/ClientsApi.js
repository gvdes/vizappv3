import { vizapi } from "src/boot/axios";
import { useAccountStore } from 'stores/Account';
const piniaAccount = useAccountStore();

export default{
  getClients(){
    let burl = `cluster/Clients/getClients`;
    return vizapi.get(burl).then( done => done.data).catch( fail => { return {error:fail} });
  },
}
