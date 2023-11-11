import { vizapi } from "src/boot/axios";

export default{
  trySignin(data){
    return vizapi.post('signin',data)
      .then( done => done.data )
      .catch( fail => fail );
  },

  firstLogin(data){
    return vizapi.post('kraken/firstlogin',data)
      .then( done => done.data)
      .catch( fail => fail );
  }
}
