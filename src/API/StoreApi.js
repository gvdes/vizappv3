import { vizapi } from "src/boot/axios";

export default{
  index({store, auths, stores}){
    return vizapi.get(`store/${store}`)
      .then( done => done.data )
      .catch( fail => fail );
  }
}
