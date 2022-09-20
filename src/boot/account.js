import { LocalStorage } from 'quasar'
import { useAccountStore } from 'stores/account'

const piniaAccount = useAccountStore();
const accountLS = LocalStorage.getItem("account");

if(accountLS){
  // console.log(accountLS);
  piniaAccount.fillLS(accountLS);
}
