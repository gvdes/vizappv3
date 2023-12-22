<template>
  <q-page>
    <div class="row q-pa-md q-gutter-md items-start">
      <AdminArea v-if="admin" @created="transferCreated" ref="admintoolbar"/>
      <div class="col">
        <List :transfers="transfersdb"/>
      </div>
      <div class="bg-blue-5">right</div>
    </div>
    <!-- Traspasoz: {{ transfersdb.length }} -->
  </q-page>
</template>

<script setup>
import { ref,computed } from 'vue'
import { useQuasar } from 'quasar'
import api from 'src/API/AppTransfers';
import { useAccountStore } from 'stores/Account';
import AdminArea from 'src/components/Apps/Transfers/AdminToolbar.vue'
import List from 'src/components/Apps/Transfers/List.vue'

const $q = useQuasar();
const transfersdb = ref([])
const piniaAccount = useAccountStore();
const admintoolbar = ref(null);

const admin = computed(() => ( [1,9,10].includes(piniaAccount.rol.id)) )

const transferCreated = (transfers) => {
  console.log(transfers)
  transfersdb.value.push(transfers.tr1)
  if (transfers.tr2){ transfersdb.value.push(transfers.tr2) }
  admintoolbar.value.clear()
}

const init = async () => {
  $q.loading.show({
    message:'Cargando index...'
  })
  const resp = await api.index();
  transfersdb.value = resp.transfers;
  $q.loading.hide();
  console.log(resp)
}

init();

// $q.loading.show({
//   message:'Comprobando ... '
// })

// setTimeout(() => {
//   $q.loading.hide()
// }, 3000)

</script>
