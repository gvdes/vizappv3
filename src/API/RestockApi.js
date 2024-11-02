import { vizapi } from "src/boot/axios";
import AddProduct from "src/components/Preorder/addProduct.vue";
import { useAccountStore } from 'stores/Account';
const piniaAccount = useAccountStore();

export default{
  index(init="",end=""){
    console.log(init,end);
    let burl = `store/${piniaAccount.join}/restock?init=${init}&end=${end}`;
    return vizapi.get(burl).then( done => done.data ).catch( fail => { console.log(fail); });
  },

  create(data){
    let burl = `store/${piniaAccount.join}/restock`;
    return vizapi.post(burl,data).then( done => done.data ).catch( fail => { console.log(fail); });
  },

  Open(rid){
    let burl = `store/${piniaAccount.join}/restock/${rid}`;
    return vizapi.get(burl).then( done => done.data ).catch( fail => { console.log(fail); return {error:fail.response} });
  },

  Discard(rid){
    let burl = `store/${piniaAccount.join}/restock/${rid}/discard`;
    return vizapi.get(burl).then( done => done.data ).catch( fail => { console.log(fail); return {error:fail.response} });
  },

  preview(rid,wrhsrc){
    let burl = `store/${piniaAccount.join}/restock/preview/${rid}?wrhsrc=${wrhsrc}`;
    return vizapi.get(burl).then( done => done.data ).catch( fail => { console.log(fail); return {error:fail.response} });
  },

  addProduct(rid,data){
    let burl = `store/${piniaAccount.join}/restock/${rid}/add`;
    return vizapi.post(burl,data).then( done => done.data ).catch( fail => { console.log(fail); return {error:fail.response} });
  }
}
