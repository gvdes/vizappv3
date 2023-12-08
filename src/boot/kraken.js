import { boot } from 'quasar/wrappers';
import { LocalStorage } from 'quasar';
import { useAccountStore } from 'stores/Account';

export default boot(({ router }) => {
  const piniaAccount = useAccountStore();

  console.log("Kraken boot has been loaded!!");
  router.beforeEach((to, from, next) => {
    console.warn(`router: "${from.path}" ==> "${to.path}"`);

    let auth = LocalStorage.getItem("auth");

    if(auth && auth.account){ //Existe una session activa y es semivalida (existe el atributo account)
      console.warn("router: Account exist in LS, setting... ");
      piniaAccount.setToken(auth.token); // setea el token en los headers de vizapi (axios) para las posteriores peticones api
      piniaAccount.setAccount(auth.account);
      piniaAccount.setStore(auth.join);
      piniaAccount.setStores(auth.stores);
      piniaAccount.setModAuths(auth.modauths);
      piniaAccount.setApps(auth.apps);

      if(auth.account._state==1){// La cuenta es nueva (state==1): es oblogatorio la configuracion de cuenta
        console.warn("router: this account is new, set a new pass (mandatory!)... ");
        if(to.path!="/welcome"){// siempre que se quiera ir a cualquier ruta que no sea /welcome, se redireccionara a /welcome para obligar al usuario a confugurar un nuevo password
          next('/welcome');
        }else if(to.path=="/welcome"){// SI (y solo si) se quiere ir a /welcome...
          next();
        }
      }else{// ya hay sesion activa y ya se ha confirmado la cuenta y no se ha solicitado cambio de la misma
        (to.path=="/login"||to.path=="/welcome") ? next(`/store/${auth.join}/`) : next();
      }
    }else{// No hay sesion activa, siempre redireccionara a /login
      console.warn("router: No account exist in LS, please start!");
      to.path=="/login" ? next() : next('/login');
    }
  })
})
