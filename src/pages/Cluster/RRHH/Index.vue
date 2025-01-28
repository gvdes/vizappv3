<template>
  <q-page padding>
    <div class="bg-white">
      <div class="q-pa-sm row items-center text-center text-h6">
        <div class="col anek-bld text-grey-9 q-pl-sm">Recursos Humanos</div>
        <div>
          <q-btn flat rounded icon="autorenew" @click="init" />
          <q-btn flat rounded  icon="album" @click="replyRegisters" title="Obtener Registros" />

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
  </q-page>

  <q-dialog v-model="wndView" persistent>
    <q-card>
      <q-card-section class="items-center">
        <q-input v-model="device.store.name" type="text" label="Sucursal" filled disable />
        <q-separator spaced inset vertical dark />
        <q-input v-model="device.id" type="text" label="Id" filled disable />
        <q-separator spaced inset vertical dark />
        <q-input v-model="device.serial_number" type="text" label="Numero de serie" filled disable />
        <q-separator spaced inset vertical dark />
        <q-input v-model="device.name" type="text" label="Dispositivo" filled disable />
        <q-separator spaced inset vertical dark />
        <q-input v-model="device.nick_name" type="text" label="Nombre" filled />
        <q-separator spaced inset vertical dark />
        <q-input v-model="device.ip" type="text" label="IP" filled>
          <template v-slot:append>
            <q-btn color="primary" icon="sensors" @click="ping(device.ip)" flat />
          </template>
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
        <q-btn color="primary" label="Eliminar Registros" @click="deleteConfirm.state = !deleteConfirm.state" outline
          class="full-width" :disable="device._att < 1000" />
      </q-card-section>
      <q-card-actions align="center">
        <q-btn flat label="Cancel" color="negative" v-close-popup />
        <q-btn flat label="Editar" color="positive" @click="edit(device)" />
      </q-card-actions>
    </q-card>
  </q-dialog>

  <q-dialog v-model="deleteConfirm.state" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="warning" color="warning" text-color="white" />
          <span class="q-ml-sm">Estas seguro de eliminar los registros ? Ya replicaste ? Segur@?</span>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="positive" v-close-popup />
          <q-btn flat label="Aceptar" color="negative" @click="deleteRegister" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="replyState.state" persistent>
      <q-card>
        <q-card-section >
         <div class="text-h5 text-center">ASISTENCIAS GRABADAS</div>
         <div v-for="(reply, index) in replyState.body" :key="index">
            <div class="text-bold">{{ reply.name }}</div>
            <div class="text-overline">{{ reply.data }}</div>
          <q-separator spaced inset vertical dark />
          </div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="OK" color="primary" @click="replyState.body = [], replyState.state = false" />
        </q-card-actions>
      </q-card>
    </q-dialog>

  <q-page-sticky position="bottom-right" :offset="[20, 20]">
    <q-fab color="primary" text-color="white" icon="keyboard_arrow_left" :direction="isMobile ? 'up' : 'left'">
      <template v-slot:label="{ opened }">
        <div :class="{ 'example-fab-animate--hover': opened !== true }">
          {{ opened !== true ? 'Opciones' : 'Cerrar' }}
        </div>
      </template>
      <div v-for="(modulo, index) in permissions" :key="index">
        <q-fab-action color="primary" :icon="modulo.module.icon" :to="`${modulo.module.path}`"
          :label="modulo.module.name" />
      </div>
    </q-fab>
  </q-page-sticky>
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


const devices = ref([]);
const replyState = ref({
  state:false,
  body:[],
  bodyfalse:[]
})
const device = ref(null);
const wndView = ref(false)
const deleteConfirm = ref({state:false})
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

const isMobile = computed(() => $q.platform.is.mobile);
const permissions = computed(() => piniaAccount.account.modules.filter((e) => e.module.root == '278j'))

const init = async () => {
  const resp = await rhpi.index()
  if (resp.error) {
    console.log('No hay conexion');
  } else {
    console.log(resp);
    devices.value = resp

    pings(devices.value);
  }

}


const pings = async (devices) => {

  devices.forEach((e, index) => {
    setTimeout(() => {
      const resp = rhpi.ping(e.id)
      resp.then(i => {
        console.log(i)
        e._status = i.connect;
        e._att = i.register
        e._time = i.date
        e._curret = i.current
      })
      resp.catch(error => {
        console.error(`Error pinging ${e.ip_address}:`, error);
      });
    }, index * 1000)

  });
}

const ping = async (ip) => {
  $q.loading.show({ message: 'Haciendo Pin :P' });
  const resp = await rhpi.ping(ip)
  if (resp.error) {
    console.log(resp)
  } else {
    let mssg = resp ? 'Con Conexion' : 'Sin Conexion';
    let type = resp ? 'positive' : 'negative';
    $q.notify({
      message: mssg,
      type: type,
      position: 'center'
    })
    $q.loading.hide();
  }
}

const view = (row) => {
  wndView.value = true
  device.value = row
}
const edit = async (device) => {
  $q.loading.show({ message: 'Editando' });
  const resp = await rhpi.edit(device);
  if (resp.error) {
    console.log(resp);
  } else {
    console.log(resp);
    wndView.value = false;
    $q.notify({
      message: 'Dispositivo Actualizado',
      type: 'positive',
      position: 'center'
    })
    $q.loading.hide();
    init()
  }
}

const replyRegister = async () => {
  const id = device.value.id
  console.log(id)
  $q.loading.show({ message: 'Impotando Registros :P' });
  const resp = await rhpi.getRegisDevice(id)
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
  const resp = await rhpi.changeDate(id)
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

const deleteRegister = async () => {
  try {
    await replyRegister();
    const id = device.value.id;
    console.log(id);

    $q.loading.show({ message: 'ELIMINANDO REGISTROS :P' });

    const resp = await rhpi.deleteAttendance(id);
    if (resp.error) {
      console.log(resp);
    } else {
      console.log(resp.data);
      $q.notify({ message: 'Registros Eliminados :)', type: 'positive', position: 'center' });
    }
  } catch (error) {
    console.error(error);
  } finally {
    $q.loading.hide();
    deleteConfirm.value.state = !deleteConfirm.value.state
  }
}

const replyRegisters =  () => {
  $q.loading.show({message:'Obteniendo Registros'})
  devices.value.forEach((e, index) => {
    setTimeout( async () =>  {
      $q.loading.show({ message: `Replicando Checadas de ${e.nick_name}` })
      replyState.value.state = true;
      const resp = await rhpi.getRegisDevice(e.id)
      if(resp.error){
        console.error(`Error pinging ${e.ip_address}:`, resp.error);
        let dat = {name:e.nick_name, data: `${e.nick_name} Sin Conexion` }
        replyState.value.body.push(dat)
      }else{
        let dat  = {name: e.nick_name, data: resp.goals}
        replyState.value.body.push(dat)
        $q.loading.hide();
      }
    }, index * 1000)
  });
}


const sync = async () => {
  console.log("Sincronizando Checadas");
  // $q.loading.show({message:'Sincronizando Checadas'})
  sucursales.value.opts.forEach((e, index) => {
    setTimeout(() => {
      if (e.label != 'All') {
        $q.loading.show({ message: `Replicando Checadas de ${e.name}` })
        api.get(`/zkt/getRegisDevice/${e.id}`)
          .then(i => {
            console.log(i.data)
            $q.loading.hide();
            let data = {name: e.name, message:i.data}
            checadas.value.goals.push(data);
            $q.notify({message:`${e.name} OK :):`,type:'positive',position:'center'})
          })
          .catch(error => {
            console.error(`Error pinging ${e.ip_address}:`, error);
            $q.loading.hide();
            $q.notify({message:`Error checador ${e.name}:`,type:'negative',position:'center'})
          });
      }

    }, index * 1000)
  })
  checadas.value.state = true;}


init()
</script>
