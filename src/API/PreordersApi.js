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
  getConfig(){
    let burl = `store/${piniaAccount.join}/orders/getConfig`;
    return vizapi.get(burl).then( done => done.data).catch( fail => { return {error:fail.response} });
  },
  getOrders(data){
    let burl = `store/${piniaAccount.join}/orders/getOrders`;
    return vizapi.post(burl,data).then( done => done.data).catch( fail => fail);
  },
  getPrints(type){
    let burl = `store/${piniaAccount.join}/orders/getPrints/${type}`;
    return vizapi.get(burl).then( done => done.data).catch( fail => fail);
  },
  create(data){
    let burl = `store/${piniaAccount.join}/orders/createOrder`;
    return vizapi.post(burl,data).then( done => done.data).catch( fail => { return {error:fail.response} });
  },
  createAnexo(data){
    let burl = `store/${piniaAccount.join}/orders/createOrderAnexo`;
    return vizapi.post(burl,data).then( done => done.data).catch( fail => { return {error:fail.response} });
  },
  addProduct(data){
    let burl = `store/${piniaAccount.join}/orders/addProduct`;
    return vizapi.post(burl,data).then( done => done.data).catch( fail => { return {error:fail.response} });
  },
  ModifyProduct(data){
    let burl = `store/${piniaAccount.join}/orders/ModifyProduct`;
    return vizapi.post(burl,data).then( done => done.data).catch( fail => { return {error:fail.error.response} });
  },
  removeProduct(data){
    let burl = `store/${piniaAccount.join}/orders/removeProduct`;
    return vizapi.post(burl,data).then( done => done.data).catch( fail => { return {error:fail.response} });
  },
  changeStatus(data){
    let burl = `store/${piniaAccount.join}/orders/changeStatus`;
    return vizapi.post(burl,data).then( done => done.data).catch( fail => { return {error:fail.error.response} });
  },
  changeConfig(data){
    let burl = `store/${piniaAccount.join}/orders/changeConfig`;
    return vizapi.post(burl,data).then( done => done.data).catch( fail => { return {error:fail.response} });
  },
  getOrdersCheckin(){
    let burl = `store/${piniaAccount.join}/orders/getOrdersCheckin`;
    return vizapi.get(burl).then( done => done.data).catch( fail => { return {error:fail.response} });
  }
}

