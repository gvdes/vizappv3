import { vizapi } from "src/boot/axios";
import { useAccountStore } from 'stores/Account';
const piniaAccount = useAccountStore();

export default{
  getClients(){
    let burl = `cluster/Clients/getClients`;
    return vizapi.get(burl).then( done => done.data).catch( fail => { return {error:fail} });
  },
  editClient(data){
    let burl = `cluster/Clients/editClient`;
    return vizapi.post(burl,data).then( done => done.data).catch( fail => { return {error:fail} });
  },
  syncCli(data){
    let burl = `cluster/Clients/replyClient`;
    return vizapi.post(burl,data).then( done => done.data).catch( fail => { return {error:fail} });
  },
}
