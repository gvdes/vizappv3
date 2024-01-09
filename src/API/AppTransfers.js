import { vizapi } from "src/boot/axios";
import { useAccountStore } from 'stores/Account';
const piniaAccount = useAccountStore();

export default {
  index(){
    let burl = `apps/${piniaAccount.join}/transfers`;
    return vizapi.get(burl).then( done => done.data ).catch( fail => fail );
  },
  create(data){
    let burl = `apps/${piniaAccount.join}/transfers`;
    return vizapi.post(burl,data).then( done => done.data ).catch( fail => fail );
  },
  adminview(){
    let burl = `apps/${piniaAccount.join}/transfers/adminview`;
    return vizapi.get(burl).then( done => done.data ).catch( fail => fail );
  },
  open(tid){
    let burl = `apps/${piniaAccount.join}/transfers/${tid}`;
    return vizapi.get(burl).then( done => done.data ).catch( fail => fail );
  },
  transfer(tid,data){
    let burl = `apps/${piniaAccount.join}/transfers/${tid}/push`;
    return vizapi.post(burl,data).then( done => done.data ).catch( fail => fail );
  }
}
