import { vizapi } from "src/boot/axios";
import { useAccountStore } from 'stores/Account';
const piniaAccount = useAccountStore();

export default{
  // ala(){return piniaAccount.account.id},
  index(){
    let burl = `cluster/accounts/users?id=${piniaAccount.account.id}`;
    return vizapi.get(burl).then( done => done.data ).catch( fail => { return {error:fail.response} });
  },
}
