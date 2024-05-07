import { vizapi } from "src/boot/axios";
import { useAccountStore } from 'stores/Account';
const piniaAccount = useAccountStore();

export default{
  index(){
    let burl = `store/${piniaAccount.join}/orders`;
    return vizapi.get(burl).then( done => done.data).catch( fail => { return {error:fail.response} });
  },
  getOrder(data){
    let burl = `store/${piniaAccount.join}/orders/${data}`;
    return vizapi.get(burl).then( done => done.data).catch( fail => fail);
  },
  create(data){
    let burl = `store/${piniaAccount.join}/orders/createOrder`;
    return vizapi.post(burl,data).then( done => done.data).catch( fail => { return {error:fail.response} });
  },
}

