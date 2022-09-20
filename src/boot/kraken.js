import { boot } from 'quasar/wrappers';
import { LocalStorage } from 'quasar';

export default boot(({ router }) => {
  router.beforeEach((to, from, next) => {

    let accountLS = LocalStorage.getItem("account");

    if(accountLS && accountLS.account){ //Existe una session activa y es semivalida (existe el atributo account)
      if(accountLS.account.change_password){// se requiere el cambio de contraseña
        if(to.path!="/passconfig"){// siempre que se quiera ir a cualquier ruta que no sea /accountconfirm, se redireccionara a /accountconfirm porque no hay sesion activa
          next('/passconfig');
        }else if(to.path=="/passconfig"){// si y solo si se quiere ir a accountconfirm...
          next();
        }
      }else{// ya ha sesion activa y ya se a confirmado la cuenta y no se ha solicitado cambio de la misma
        (to.path=="/login"||to.path=="/passconfig") ? next(`/store/${accountLS.join}`) : next();
      }
    }else{// No hay sesion activa, siempre redireccionara a /acceso
      // console.log("No hay sesion activa, se intento ir a "+to.path+" redireccionado a: "+to.path);
      to.path=="/login" ? next() : next('/login');
    }
  })
})
