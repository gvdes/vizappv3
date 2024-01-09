<template>
  <q-page>
    <div class="row q-pa-md q-gutter-md items-start">
      <AdminArea ref="admintoolbar" v-if="admin" @created="transferCreated" :daykey="daykey" :rowkeys="rowkeys"/>
      <div class="col">
        <List :transfers="transfersdb" @open="openTransfer" />
      </div>
      <!-- <div class="bg-blue-5">
        <pre>{{ rowkeys }}</pre>
      </div> -->
    </div>
    <!-- Traspasoz: {{ transfersdb.length }} -->
  </q-page>
</template>

<script setup>
import { date } from 'quasar'
import { ref,computed } from 'vue'
import { useQuasar } from 'quasar'
import api from 'src/API/AppTransfers';
import { useAccountStore } from 'stores/Account';
import AdminArea from 'src/components/Apps/Transfers/AdminToolbar.vue'
import List from 'src/components/Apps/Transfers/List.vue'
import { useRouter } from 'vue-router'

const $router = useRouter();
const $q = useQuasar();
const transfersdb = ref([])
const piniaAccount = useAccountStore();
const admintoolbar = ref(null);
const now = Date.now();
const admin = computed(() => ( [1,9,10].includes(piniaAccount.rol.id)) )
const daykey = date.formatDate(now, 'MMDDYY')
const rowkeys = computed(() => transfersdb.value.map( t => `${t.from.id}${t.to.id}-${daykey}`) )

const transferCreated = (transfers) => {
  console.log(transfers)
  transfersdb.value.push(transfers.tr1)
  if (transfers.tr2){ transfersdb.value.push(transfers.tr2) }
  admintoolbar.value.clear()
}

const init = async () => {
  $q.loading.show({ message:'Cargando index...' })
  const resp = await api.index();
  console.log(resp);
  transfersdb.value = resp.transfers;
  $q.loading.hide();
}

const openTransfer = t => $router.push(`transfers/${t.id}`);

init();

</script>
