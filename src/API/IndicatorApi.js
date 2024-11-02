import { vizapi } from "src/boot/axios";
import { useAccountStore } from 'stores/Account';
const piniaAccount = useAccountStore();

export default{
  index(loc){
    let burl = `store/${piniaAccount.join}/locator/location/${loc}`;
    return vizapi.get(burl).then( done => done.data ).catch( fail => { return {error:fail.response} });
  },
  getForms(){
    let burl = `cluster/Indicators/getForms`;
    return vizapi.get(burl).then( done => done.data ).catch( fail => { return {error:fail.response} });
  },
  addForm(data){
    let burl = `cluster/Indicators/addForm`;
    return vizapi.post(burl,data).then( done => done.data ).catch( fail => { return {error:fail.response} });
  },
  getForm(data){
    let burl = `cluster/Indicators/${data}`;
    return vizapi.get(burl).then( done => done.data ).catch( fail => { return {error:fail.response} });
  },
  AddQuestion(data){
    let burl = `cluster/Indicators/addQuestion`;
    return vizapi.post(burl,data).then( done => done.data ).catch( fail => { return {error:fail.error.response} });
  },
  getFormResp(data){
    let burl = `resp/form/${data}`;
    return vizapi.get(burl).then( done => done.data ).catch( fail => { return {error:fail.response} });
  },
  changeStatusForm(data){
    let burl = `cluster/Indicators/changeStatus`;
    return vizapi.post(burl,data).then( done => done.data ).catch( fail => { return {error:fail.response} });
  },
  editQuest(data){
    let burl = `cluster/Indicators/editQuest`;
    return vizapi.post(burl,data).then( done => done.data ).catch( fail => { return {error:fail.error.response} });
  },
  deleteQuest(data){
    let burl = `cluster/Indicators/deleteQuest`;
    return vizapi.post(burl,data).then( done => done.data ).catch( fail => { return {error:fail.error.response} });
  },
}
