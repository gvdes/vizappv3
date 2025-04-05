import { vizapi } from "src/boot/axios";
import { useAccountStore } from 'stores/Account';
const piniaAccount = useAccountStore();

export default{
  getCash(){
    let burl = `store/${piniaAccount.join}/cash/getCash`;
    return vizapi.get(burl).then( done => done.data).catch( fail => { return {error:fail} });
  },
  openCash(data){
    let burl = `store/${piniaAccount.join}/cash/OpenCash`;
    return vizapi.post(burl,data).then( done => done.data).catch( fail => { return {error:fail} });
  },
  closeBox(data){
    let burl = `store/${piniaAccount.join}/cash/closeBox`;
    return vizapi.post(burl,data).then( done => done.data).catch( fail => { return {error:fail} });
  },
  getDocument(){
    let burl = `cluster/cash/getDocument`;
    return vizapi.get(burl).then( done => done.data).catch( fail => { return {error:fail} });
  },
  editDocument(data){
    let burl = `cluster/cash/editDocument`;
    return vizapi.post(burl,data).then( done => done.data).catch( fail => { return {error:fail} });
  },
  getTPV(){
    let burl = `cluster/cash/getTPV`;
    return vizapi.get(burl).then( done => done.data).catch( fail => { return {error:fail} });
  },
  addTPV(data){
    let burl = `cluster/cash/addTPV`;
    return vizapi.post(burl,data).then( done => done.data).catch( fail => { return {error:fail} });
  },
  editTPV(data){
    let burl = `cluster/cash/editTPV`;
    return vizapi.post(burl,data).then( done => done.data).catch( fail => { return {error:fail} });
  },
  mosFIle(id){
    let burl = `cluster/cash/mosFIle/${id}`;
    return vizapi.get(burl, { responseType: 'blob' }).then( done => done.data).catch(fail => { return { error: fail }; });
  },
  index(){
    let burl = `cluster/cash/Index`;
    return vizapi.get(burl).then( done => done.data).catch(fail => { return { error: fail }; });
  },
  editCash(data){
    let burl = `cluster/cash/editCash`;
    return vizapi.post(burl,data).then( done => done.data).catch(fail => { return { error: fail }; });
  },
  getCashAssigned(){
    let burl = `store/${piniaAccount.join}/cash/getCashAssigned`;
    return vizapi.get(burl).then( done => done.data).catch(fail => { return { error: fail }; });
  }
}

