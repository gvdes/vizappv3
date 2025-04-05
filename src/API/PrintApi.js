import { vizapi } from "src/boot/axios";
import { useAccountStore } from 'stores/Account';
const piniaAccount = useAccountStore();

export default{
  index(){
    let burl = `cluster/Printers/index`;
    return vizapi.get(burl).then( done => done.data).catch( fail => { return {error:fail.error.response} });
  },
  getPrinterStore(){
    let burl = `store/${piniaAccount.join}/Printers/getPrinterStore`;
    return vizapi.get(burl).then( done => done.data).catch( fail => { return {error:fail.error.response} });
  },
  testPrint(data){
    let burl = `cluster/Printers/testPrint`;
    return vizapi.post(burl,data).then( done => done.data).catch( fail => { return {error:fail.error.response} });
  },
  editPrint(data){
    let burl = `cluster/Printers/editPrint`;
    return vizapi.post(burl,data).then( done => done.data).catch( fail => { return {error:fail.error.response} });
  },
  deletePrint(data){
    let burl = `cluster/Printers/deletePrint`;
    return vizapi.post(burl,data).then( done => done.data).catch( fail => { return {error:fail.error.response} });
  },
  form(){
    let burl = `store/${piniaAccount.join}/rrhh/form`
    return vizapi.get(burl).then( done => done.data).catch( fail => { return {error:fail.error.response} });
  },
}

