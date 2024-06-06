import { vizapi } from "src/boot/axios";
import { useAccountStore } from 'stores/Account';
const piniaAccount = useAccountStore();

export default{
  // ala(){return piniaAccount.account.id},
  index(){
    let burl = `cluster/accounts/users`;
    return vizapi.get(burl).then( done => done.data ).catch( fail => { return {error:fail.response} });
  },

  opts(){
    let burl = `cluster/accounts/getIndex`;
    return vizapi.get(burl).then( done => done.data ).catch( fail => { return {error:fail.response} });
  },

  adduser(data){
    let burl = `cluster/accounts/adduser`;
    return vizapi.post(burl,data).then( done => done.data ).catch( fail => { return {error:fail.response} });
  },

  workus(){
    let burl = `cluster/accounts/getUserWor`;
    return vizapi.get(burl).then( done => done.data ).catch( fail => { return {error:fail.response} });
  },
  getPermissionsRol(data){
    let burl = `cluster/accounts/getPermissionsRol/${data}`;
    return vizapi.get(burl).then( done => done.data ).catch( fail => { return {error:fail.response} });
  },

  changework(data){
    let burl = `cluster/accounts/changework`;
    return vizapi.put(burl,data).then( done => done.data ).catch( fail => { return {error:fail.response} });
  },
  updateuser(data){
    let burl = `cluster/accounts/updateuser`;
    return vizapi.post(burl,data).then( done => done.data ).catch( fail => { return {error:fail.response} });
  },
  positions(){
    let burl = `cluster/accounts/getPosition`;
    return vizapi.get(burl).then( done => done.data ).catch( fail => { return {error:fail.response} });
  },
  addArea(data){
    let burl = `cluster/accounts/addArea`;
    return vizapi.post(burl,data).then( done => done.data ).catch( fail => { return {error:fail.response} });
  },
  addPuesto(data){
    let burl = `cluster/accounts/addPuesto`;
    return vizapi.post(burl,data).then( done => done.data ).catch( fail => { return {error:fail.response} });
  }
}
