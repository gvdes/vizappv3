import { boot } from 'quasar/wrappers';
import { LocalStorage } from 'quasar';
import { useAccountStore } from 'stores/Account';

export default boot(({ router }) => {
  const piniaAccount = useAccountStore();

  console.log("Kraken boot has been loaded!!");
  router.beforeEach((to, from, next) => {

    let auth = LocalStorage.getItem("auth");

    if(auth && auth.account){ //Existe una session activa y es semivalida (existe el atributo account)
      piniaAccount.setAccount(auth.account);
      piniaAccount.setToken(auth.token);
      piniaAccount.setJoin(auth.join);
      piniaAccount.setStores(auth.stores);
      piniaAccount.setModAuths(auth.modauths);


      if(auth.account._state==1){// La cuenta es nueva (state==1): es oblogatorio la configuracion de cuenta
        if(to.path!="/welcome"){// siempre que se quiera ir a cualquier ruta que no sea /welcome, se redireccionara a /accountconfirm porque no hay sesion activa
          next('/welcome');
        }else if(to.path=="/welcome"){// si y solo si se quiere ir a accountconfirm...
          next();
        }
      }else{// ya hay sesion activa y ya se ha confirmado la cuenta y no se ha solicitado cambio de la misma
        (to.path=="/login"||to.path=="/welcome") ? next(`/store/${auth.join}`) : next();
      }
    }else{// No hay sesion activa, siempre redireccionara a /acceso
      to.path=="/login" ? next() : next('/login');
    }
  })
})
