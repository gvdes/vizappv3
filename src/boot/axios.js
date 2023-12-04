import { boot } from 'quasar/wrappers'
import { Notify } from 'quasar'
import axios from 'axios'

const vizapi = axios.create({
  baseURL: 'http://192.168.10.182:1920/kraken/public/api'
  // baseURL: 'http://192.168.12.46/vizapi/public/api'
  // baseURL: 'http://192.168.1.68:80/arceus/public/api'
});

vizapi.interceptors.response.use( response => {
  console.log("%cREQUEST DONE!!","color: #32ff7e; font-size:.8em; padding:5px 10px; border:1px solid #3ae374; margin:5px 0; font-weight:bold; background: #004D40;");
  return response;
}, error => { // Cualquier código de estado que este fuera del rango de 2xx causa la ejecución del error
  if(error.response){// hay conexion al servidor pero el status de repsuesta no es 200 status de respuesta
    if(error.response.status==511){
      // vaciar localstorage y redireccionar al inicio de sesion
      alert(error.response.data);
    }
  }else{// este error salta unicamente cuando el servidor esta muerto (response es null en el error del request)
    console.log("%cERROR NETWORK","color:#e17055; padding:5px 10px; border:1px solid #d63031; margin:5px 0; font-weight:bold;");
    Notify.create({
      message: 'No se pudo establecer conexion al servidor',
      color:"negative",
      icon:"fas fa-cloud-bolt",
      timeout:60000,
      position:"center"
    });
  }

  return Promise.reject({error});
});

export { vizapi }
