import { vizapi } from "src/boot/axios";

export default{
  index(data){
    return vizapi.get(`store/${data.store}`).then( done => done.data ).catch( fail => { return {error:fail.response} });
  }
}
