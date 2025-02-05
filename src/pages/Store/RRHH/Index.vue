<template>
  <q-page padding>

    <div class="bg-white">
      <div class="q-pa-sm row items-center text-center text-h6">
        <div class="col anek-bld text-grey-9 q-pl-sm">Recursos Humanos</div>
        <div>
          <q-btn flat rounded icon="autorenew" @click="init" />
        </div>
      </div>
    </div>

    <q-table hide-bottom :rows="devices" :columns="table.columns" row-key="name" grid :filter="table.filter"
      :pagination="table.pagination">
      <template v-slot:top-right>
        <q-input borderless dense debounce="300" v-model="table.filter" placeholder="Buscar">
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </template>

      <template v-slot:item="props">
        <div class="q-pa-xs col-xs-12 col-sm-6 col-md-4">
          <q-card flat bordered :style="`border: 3px solid ${props.row._status ? '#03C988' : '#B80000'};`"
            @click="view(props.row)">
            <q-card-section class="text-center">
              <div class="row">
                <div class="col">
                  Sucursal
                  <br>
                  <strong>{{ props.row.store.name }}</strong>
                </div>
                <div class="col">
                  Dispositivo
                  <br>
                  <strong>{{ props.row.nick_name }}</strong>
                </div>
              </div>
            </q-card-section>
            <q-separator />
            <q-card-section class="text-center">
              <div class="row">
                <div class="col">
                  Horario
                  <br>
                  <strong>{{ props.row.ip }}</strong>
                </div>
                <div class="col">
                  Dispositivo
                  <br>
                  <strong>{{ props.row.serial_number }}</strong>
                </div>
              </div>
            </q-card-section>
            <q-separator />
            <q-card-section class="text-center">
              <div class="row">

                <div class="col">
                  Horario
                  <br>
                  <strong>{{ props.row._curret }}</strong>
                </div>
                <div class="col">
                  Dispositivo
                  <br>
                  <strong>{{ props.row._time }}</strong>
                </div>
              </div>
            </q-card-section>
            <q-separator />
            <q-card-section class="text-center">
              <div class="row">
                <div class="col">
                  Registros
                  <br>
                  <strong>{{ props.row._att }}</strong>
                </div>
                <div class="col">
                  Diferencia Tiempo
                  <br>
                  <strong>{{ dayjs(props.row._time).diff(dayjs(props.row._curret), 'second', true) }} s</strong>
                </div>

              </div>
            </q-card-section>
            <q-separator />
          </q-card>
        </div>
      </template>
    </q-table>


    <q-dialog v-model="wndView" persistent>
      <q-card style="width: 300px">
        <q-card-section class="items-center">
          <q-input v-model="device.store.name" type="text" label="Sucursal" filled disable />
          <q-separator spaced inset vertical dark />
          <q-input v-model="device.id" type="text" label="Id" filled disable />
          <q-separator spaced inset vertical dark />
          <q-input v-model="device.serial_number" type="text" label="Numero de serie" filled disable />
          <q-separator spaced inset vertical dark />
          <q-input v-model="device.name" type="text" label="Dispositivo"  filled disable />
          <q-separator spaced inset vertical dark />
          <q-input v-model="device.nick_name" type="text" label="Nombre"  disable filled />
          <q-separator spaced inset vertical dark />
          <q-input v-model="device.ip" type="text" label="IP" filled disable>
          </q-input>
          <q-separator spaced inset vertical dark />

          <div class="text-center">Dispositivo: <div class="text-center">{{ device._time }}</div>
          </div>
          <q-separator spaced inset vertical dark />
          <div class="text-center"> Horario: <div class="text-centert">{{ device._curret }}</div>
          </div>
          <q-separator spaced inset vertical dark />
          <div class="text-center">Diferencia: <div class="text-center">{{
            dayjs(device._time).diff(dayjs(device._curret),
              'second', true) }}</div>
          </div>
        </q-card-section>

        <q-card-section>
          <q-btn color="primary" label="Registros" @click="replyRegister" outline class="full-width" />
          <q-separator spaced inset vertical dark />
          <q-btn color="primary" label="Cambiar Horario" @click="changeDate" outline class="full-width" />
          <q-separator spaced inset vertical dark />
        </q-card-section>
        <q-card-actions align="center">
          <q-btn flat label="Ok" color="primary" v-close-popup />
          <!-- <q-btn flat label="Editar" color="positive" @click="edit(device)" /> -->
        </q-card-actions>
      </q-card>
    </q-dialog>


  </q-page>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import rhpi from 'src/API/RhApi';
import { useAccountStore } from 'stores/Account';
const $q = useQuasar();
const $router = useRouter();
import dayjs from 'dayjs';

const piniaAccount = useAccountStore();
console.log(piniaAccount.join)
const devices = ref([]);
const device = ref('')
const wndView = ref(false)
const table = ref({
  columns: [
    { name: 'id', label: 'id', field: row => row.id },
    { name: 'name', label: 'Dispositivo', field: row => row.name },
    { name: 'nick_name', label: 'Nombre', field: row => row.nick_name },
    { name: 'id', label: 'Numero de Serie', field: row => row.serial_number },
    { name: 'ip', label: 'Direccion Ip', field: row => row.ip },
    { name: 'store', label: 'Sucursal', field: row => row.store.name }
  ],
  filter: '',
  pagination: { rowsPerPage: [0] }
})

const init = async () => {
  const resp = await rhpi.indexStore()
  if (resp.error) {
    console.log('No hay conexion');
    if (resp.error.status == 405) {
      $router.push('/')
      $q.notify({ message: 'No tienes acceso a esta pagina', type: 'negative', position: 'center' })
    }
  } else {
    console.log(resp);
    devices.value = resp.filter(e => e._store == piniaAccount.join)
    pings(devices.value);
  }

}


const pings = async (devices) => {

  devices.forEach((e, index) => {

    setTimeout(() => {
      // console.log(e.id)
      const resp = rhpi.pingStore(e.id)
      resp.then(i => {
        console.log(i)
        e._status = i.connect;
        e._att = i.register
        e._time = i.date
        e._curret = i.current
      })
      resp.catch(error => {
        console.error(`Error pinging ${e.ip}:`, error);
      });
    }, index * 1000)

  });
}

const view = (row) => {
  wndView.value = true
  device.value = row
}


const replyRegister = async () => {
  const id = device.value.id
  console.log(id)
  $q.loading.show({ message: 'Impotando Registros :P' });
  const resp = await rhpi.getRegisDeviceStore(id)
  if (resp.error) {
    console.log(resp)
  } else {
    console.log(resp)
    $q.notify({ message: resp.goals, type: 'positive', position: 'center' })
    $q.loading.hide();
  }
}

const changeDate = async () => {
  const id = device.value.id
  console.log(id)
  $q.loading.show({ message: 'Cambiando Horario :P' });
  const resp = await rhpi.changeDateStore(id)
  if (resp.error) {
    console.log(resp)
  } else {
    console.log(resp)
    device.value.time = resp.date
    device.value.curret = resp.date
    $q.notify({ message: 'Cambio Realizado :)', type: 'positive', position: 'center' })
    $q.loading.hide();
  }
}

init()
</script>
