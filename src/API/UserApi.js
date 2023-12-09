import { vizapi } from "src/boot/axios";
import { useAccountStore } from 'stores/Account';
const piniaAccount = useAccountStore();

export default{
  // ala(){return piniaAccount.account.id},
  index(){
    let burl = `cluster/accounts/users?id=${piniaAccount.account.id}`;
    return vizapi.get(burl).then( done => done.data ).catch( fail => { return {error:fail.response} });
  },

  opts(){
    let burl = `cluster/accounts/getIndex?id=${piniaAccount.account.id}`;
    return vizapi.get(burl).then( done => done.data ).catch( fail => { return {error:fail.response} });
  },

  adduser(data){
    let burl = `cluster/accounts/adduser?id=${piniaAccount.account.id}`;
    return vizapi.post(burl,data).then( done => done.data ).catch( fail => { return {error:fail.response} });
  },

  workus(){
    let burl = `cluster/accounts/getUserWor?id=${piniaAccount.account.id}`;
    return vizapi.get(burl).then( done => done.data ).catch( fail => { return {error:fail.response} });
  },

  changework(data){
    let burl = `cluster/accounts/changework?id=${piniaAccount.account.id}`;
    return vizapi.put(burl,data).then( done => done.data ).catch( fail => { return {error:fail.response} });
  },
}
