import { vizapi } from "src/boot/axios";
// import { useAccountStore } from 'stores/Account';
// const piniaAccount = useAccountStore();

export default {
  list(){ return vizapi.get('cluster/accounts').then( done => done.data ).catch( fail => fail ); },
  create(data){ return vizapi.post('cluster/accounts', data).then( done => done.data ).catch( fail => fail ); }
}
