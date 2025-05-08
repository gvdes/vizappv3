import { vizapi } from "src/boot/axios";
import { useAccountStore } from 'stores/Account';
const piniaAccount = useAccountStore();

export default{
  index(){
    let burl = `cluster/Products/index`;
    return vizapi.get(burl).then( done => done.data).catch( fail => { return {error:fail} });
  },
  searchProd(data){
    let burl = `cluster/Products/searchProd`;
    return vizapi.post(burl,data).then( done => done.data).catch( fail => { return {error:fail} });
  },
  getProduct(data){
    let burl = `cluster/Products/getProduct/${data}`;
    return vizapi.get(burl).then( done => done.data).catch( fail => { return {error:fail.response} });
  },
}
