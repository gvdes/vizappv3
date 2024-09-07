import { vizapi } from "src/boot/axios";
import { useAccountStore } from 'stores/Account';
const piniaAccount = useAccountStore();

export default{
  index(wid){
    let burl = `store/${piniaAccount.join}/warehouses/${wid}/comparatool`;
    return vizapi.get(burl).then( done => done.data ).catch( fail => { return {error:fail.response} });
  },

  getReport(wid, report){
    let burl = `store/${piniaAccount.join}/warehouses/${wid}/comparatool/report/${report}`;
    return vizapi.get(burl).then( done => done.data ).catch( fail => { return {error:fail.response} });
  },
}
