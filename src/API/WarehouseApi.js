import { vizapi } from "src/boot/axios";
import { useAccountStore } from 'stores/Account';
const piniaAccount = useAccountStore();

export default{
  index(){
    let burl = `store/${piniaAccount.join}/warehouses`;
    return vizapi.get(burl).then( done => done.data ).catch( fail => { return {error:fail.response} });
  },

  create(data){
    let burl = `store/${piniaAccount.join}/warehouses`;
    return vizapi.post(burl,data).then( done => done.data ).catch( fail => { return {error:fail.error.response} });
  },

  open(wid){
    let burl = `store/${piniaAccount.join}/warehouses/${wid}`;
    return vizapi.get(burl).then( done => done.data ).catch( fail => { return {error:fail.response} });
  },

  structure(wid){
    let burl = `store/${piniaAccount.join}/warehouses/${wid}/structure`;
    return vizapi.get(burl).then( done => done.data ).catch( fail => { return {error:fail.response} });
  },

  section(wid,lid){
    let burl = `store/${piniaAccount.join}/warehouses/${wid}/section/${lid}/structure`;
    return vizapi.get(burl).then( done => done.data ).catch( fail => { return {error:fail.response} });
  },

  sectionate(data,wid){
    let burl = `store/${piniaAccount.join}/warehouses/${wid}/structure`;
    return vizapi.post(burl,data).then( done => done.data ).catch( fail => { return {error:fail.response} });
  },

  products(wid){
    let burl = `store/${piniaAccount.join}/warehouses/${wid}/products`;
    return vizapi.get(burl).then( done => done.data ).catch( fail => { return {error:fail.response} });
  },

  resumen(wid){
    let burl = `store/${piniaAccount.join}/warehouses/${wid}/resume`;
    return vizapi.get(burl).then( done => done.data ).catch( fail => { return {error:fail.response} });
  },

  report(wid,repid){
    let burl = `store/${piniaAccount.join}/warehouses/${wid}/report/${repid}`;
    return vizapi.get(burl).then( done => done.data ).catch( fail => { return {error:fail.response} });
  }
}
