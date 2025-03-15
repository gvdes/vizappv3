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
  changeQualified(data){
    let burl = `cluster/Indicators/changeQualified`;
    return vizapi.post(burl,data).then( done => done.data ).catch( fail => { return {error:fail.response} });
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
  getFormResp(data,sid){
    let burl = `store/${sid}/resp/form/${data}`;
    return vizapi.get(burl).then( done => done.data ).catch( fail => { return {error:fail.error.response} });
  },
  changeStatusForm(data){
    let burl = `cluster/Indicators/changeStatus`;
    return vizapi.post(burl,data).then( done => done.data ).catch( fail => { return {error:fail.error.response} });
  },
  editQuest(data){
    let burl = `cluster/Indicators/editQuest`;
    return vizapi.post(burl,data).then( done => done.data ).catch( fail => { return {error:fail.error.response} });
  },
  deleteQuest(data){
    let burl = `cluster/Indicators/deleteQuest`;
    return vizapi.post(burl,data).then( done => done.data ).catch( fail => { return {error:fail.error.response} });
  },
  addResponse(data,sid){
    let burl = `store/${sid}/resp/form/addResponse`
    return vizapi.post(burl,data).then( done => done.data ).catch( fail => { return {error:fail.error.response} });
  },
  getClass(){
    let burl = `cluster/Indicators/getClass`
    return vizapi.get(burl).then( done => done.data ).catch( fail => { return {error:fail.error.response} });
  },
  editClass(data){
    let burl = `cluster/Indicators/editClass`
    return vizapi.post(burl,data).then( done => done.data ).catch( fail => { return {error:fail.error.response} });
  },
  getClassStore(){
    let burl = `cluster/Indicators/getClassStore`
    return vizapi.get(burl).then( done => done.data ).catch( fail => { return {error:fail.error.response} });
  },
  editClassStore(data){
    let burl = `cluster/Indicators/editClassStore`
    return vizapi.post(burl,data).then( done => done.data ).catch( fail => { return {error:fail.error.response} });
  },
  getUserClass(){
    let burl = `cluster/Indicators/getUserClass`
    return vizapi.get(burl).then( done => done.data ).catch( fail => { return {error:fail.error.response} });
  },
  editUserClass(data){
    let burl = `cluster/Indicators/editUserClass`
    return vizapi.post(burl,data).then( done => done.data ).catch( fail => { return {error:fail.error.response} });
  },
  editUserStore(data){
    let burl = `cluster/Indicators/editUserStore`
    return vizapi.post(burl,data).then( done => done.data ).catch( fail => { return {error:fail.error.response} });
  },
  changeUserBonues(data){
    let burl = `cluster/Indicators/changeUserBonues`
    return vizapi.post(burl,data).then( done => done.data ).catch( fail => { return {error:fail.error.response} });
  },
  getformResponses(data){
    let burl = `cluster/Indicators/getformResponses`
    return vizapi.post(burl,data).then( done => done.data ).catch( fail => { return {error:fail.error.response} });
  },
  viewResponseForm(id){
    let burl = `cluster/Indicators/${id}/viewResponseForm`
    return vizapi.get(burl).then( done => done.data ).catch( fail => { return {error:fail.error.response} });
  },
  getCalculateClassUser(user){
    let burl = `cluster/Indicators/getCalculateClassUser`
    return vizapi.post(burl,user).then( done => done.data ).catch( fail => { return {error:fail.error.response} });
  },
  compareUserClassification(userId){
    let burl = `cluster/Indicators/compareUserClassification/${userId}`
    return vizapi.get(burl).then( done => done.data ).catch( fail => { return {error:fail.error.response} });
  }
}
