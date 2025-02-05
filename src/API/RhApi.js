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
    return vizapi.get(burl).then( done => done.data).catch( fail => { return {error:fail.error.response} });
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
  },
  getReportWeek(){
    let burl = `cluster/Assist/getReportWeek`;
    return vizapi.get(burl).then( done => done.data).catch( fail => { return {error:fail.error.response} });
  },
  addProceeding(data){
    let burl = `cluster/Assist/addProceedings`;
    return vizapi.post(burl,data).then( done => done.data).catch( fail => { return {error:fail.error.response} });
  },
  getTurnsWeek(){
    let burl = `store/${piniaAccount.join}/rrhh/getTurnsWeek`
    return vizapi.get(burl).then( done => done.data).catch( fail => { return {error:fail.error.response} });
  },
  addTurnsWeek(data){
    let burl = `store/${piniaAccount.join}/rrhh/addTurnsWeek`
    return vizapi.post(burl,data).then( done => done.data).catch( fail => { return {error:fail.error.response} });
  },
  indexStore(){
    let burl = `store/${piniaAccount.join}/rrhh/index`;
    return vizapi.get(burl).then( done => done.data).catch( fail => { return {error:fail.error.response} });
  },
  pingStore(device){
    let burl = `store/${piniaAccount.join}/rrhh/pingStore/${device}`;
    return vizapi.get(burl).then( done => done.data).catch( fail => { return {error:fail.error.response} });
  },
  getRegisDeviceStore(device){
    let burl = `store/${piniaAccount.join}/rrhh/getRegisDevice/${device}`;
    return vizapi.post(burl).then( done => done.data).catch( fail => { return {error:fail.error.response} });
  },
  changeDateStore(device){
    let burl = `store/${piniaAccount.join}/rrhh/changeDate/${device}`;
    return vizapi.post(burl).then( done => done.data).catch( fail => { return {error:fail.error.response} });
  },
  getReportWeekStore(){
    let burl = `store/${piniaAccount.join}/rrhh/getReportWeek`;
    return vizapi.get(burl).then( done => done.data).catch( fail => { return {error:fail.error.response} });
  },

}
