import { vizapi } from "src/boot/axios";
import { useAccountStore } from 'stores/Account';
const piniaAccount = useAccountStore();

export default{
  index(init,end){
    console.log(init,end);
    let burl = `store/${piniaAccount.join}/restock?init=${init}&end=${end}`;
    return vizapi.get(burl).then( done => done.data ).catch( fail => { return {error:fail.response} });
  },

  create(data){
    let burl = `store/${piniaAccount.join}/restock`;
    return vizapi.post(burl,data).then( done => done.data ).catch( fail => { return {error:fail.response} });
  },

  outofstock(){
    let burl = `store/${piniaAccount.join}/restock/outofstock`;
    return vizapi.get(burl).then( done => done.data ).catch( fail => { return {error:fail.response} });
  }
}
