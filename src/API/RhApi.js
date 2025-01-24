import { vizapi } from "src/boot/axios";
import { useAccountStore } from 'stores/Account';
const piniaAccount = useAccountStore();

export default{
  index(){
    let burl = `cluster/Assist/index`;
    return vizapi.get(burl).then( done => done.data).catch( fail => { return {error:fail.error.response} });
  },
  ping(device){
    let burl = `cluster/Assist/ping/${device}`;
    return vizapi.get(burl).then( done => done.data).catch( fail => { return {error:fail.error.response} });
  },
  edit(device){
    let burl = `cluster/Assist/edit`;
    return vizapi.post(burl,device).then( done => done.data).catch( fail => { return {error:fail.error.response} });
  },
  newD(){
    let burl = `cluster/Assist/new`;
    return vizapi.get(burl).then( done => done.data).catch( fail => { return {error:fail.errpr.response} });
  },
  pingN(device){
    let burl = `cluster/Assist/pingNew/${device}`;
    return vizapi.get(burl).then( done => done).catch( fail => { return {error:fail.error.response} });
  },
  addDevice(device){
    let burl = `cluster/Assist/addDevice`;
    return vizapi.post(burl,device).then( done => done.data).catch( fail => { return {error:fail.error.response} });
  },
  form(){
    let burl = `store/${piniaAccount.join}/rrhh/form`
    return vizapi.get(burl).then( done => done.data).catch( fail => { return {error:fail.error.response} });
  },
  addFile(){
    return  `${vizapi.defaults.baseURL}/store/${piniaAccount.join}/rrhh/addFile`
  },
  addForm(data){
    let burl = `store/${piniaAccount.join}/rrhh/addForm`
    return vizapi.post(burl,data).then( done => done.data).catch( fail => { return {error:fail.error.response} });
  },
  getJustifications(){
    let burl = `cluster/Assist/getJustifications`
    return vizapi.get(burl).then( done => done.data).catch( fail => { return {error:fail.error.response} });
  },
  changeStatus(data){
    let burl = `cluster/Assist/changeStatus`
    return vizapi.post(burl,data).then( done => done.data).catch( fail => { return {error:fail.error.response} });
  },
  getRegisDevice(device){
    let burl = `cluster/Assist/getRegisDevice/${device}`;
    return vizapi.post(burl).then( done => done.data).catch( fail => { return {error:fail.error.response} });
  },
  changeDate(device){
    let burl = `cluster/Assist/changeDate/${device}`;
    return vizapi.post(burl).then( done => done.data).catch( fail => { return {error:fail.error.response} });
  },
  deleteAttendance(device){
    let burl = `cluster/Assist/deleteAttendance/${device}`;
    return vizapi.delete(burl).then( done => done.data).catch( fail => { return {error:fail.error.response} });
  }



}
