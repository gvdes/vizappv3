import { vizapi } from "src/boot/axios";

export default{
  trySignin(data){
    return vizapi.post('signin',data).then( done => {
      let data = done.data;
      return data;
    }).catch( fail => { return { error:fail } });
  },

  setPass(data){
    return vizapi.post('kraken/setpass',data).then( done => {
      let data = done.data;
      return data;
    }).catch( fail => { return { error:fail } });
  },

  // join(data){
  //   return vizapi.post('kraken/joinat',data).then( done => {
  //     let data = done.data;
  //     return data;
  //   }).catch( fail => { return { error:fail } });
  // }
}
