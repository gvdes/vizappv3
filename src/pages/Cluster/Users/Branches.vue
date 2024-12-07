<template>
  <q-page padding>
    <div class="bg-white">
      <div class="q-pa-sm row items-center text-center text-h6">
        <div @click="$router.push('/cluster/usuarios')">
          <q-icon size="30px" name="arrow_back" />
        </div>
        <div class="col anek-bld text-grey-9 q-pl-sm">Usuarios X Sucursal</div>
        <div>
          <q-btn flat rounded icon="autorenew" @click="init" />
        </div>
      </div>
    </div>
    <q-separator spaced inset vertical dark />

    <q-table v-if="branch" hide-bottom :pagination="table.pagination" :rows="branch" grid>
      <template v-slot:item="props">
        <div class="q-pa-xs col-xs-12 col-sm-6 col-md-4" @drop="onDrop($event, props.row.id)" @dragenter.prevent
          @dragover.prevent>
          <q-card class="my-card" flat>
            <q-card-section>
              <div></div>
              <div class="text-h6 text-white bg-blue-6">
                <q-icon name="store" size="30px" color="white" />{{
                  props.row.name.toUpperCase()
                }}
                ({{ getlist(props.row.id).length }})
                <q-btn color="white" round flat dense :icon="props.expand ? 'keyboard_arrow_up' : 'keyboard_arrow_down'
                  " @click="props.expand = !props.expand" />
              </div>
            </q-card-section>
            <q-slide-transition>
              <div v-show="props.expand">
                <div v-for="item in getlist(props.row.id)" :key="item.id" :draggable="true"
                  @dragstart="startDrag($event, item)">
                  <q-card class="my-card" flat bordered>
                    <q-card-section class="row between">
                      <div class="col">{{ item.name }} {{ item.surnames }}</div>
                      <div class="col">
                        <q-badge class="bg-blue-8">
                          {{ item.rol.name }}
                        </q-badge>
                      </div>
                      <q-separator />
                    </q-card-section>
                  </q-card>
                </div>
              </div>
            </q-slide-transition>
          </q-card>
        </div>
      </template>
    </q-table>



    <q-dialog v-model="drop">
      <q-card style="width: 700px; max-width: 80vw;">

          <q-card-section>
            <q-splitter v-model="splitter" style="height: 305px">
              <template v-slot:before>
                <q-tabs v-model="tab2" vertical class="text-primary">
                  <q-tab name="workpoints" icon="store" label="Sucursales" />
                  <q-tab name="positions" icon="lock" label="Rol" />
                  <q-tab name="apps" icon="app_registration" label="Apps" />
                </q-tabs>
              </template>
              <template v-slot:after>
                <q-tab-panels v-model="tab2" animated swipeable vertical transition-prev="jump-up"
                  transition-next="jump-up">
                  <q-tab-panel name="workpoints">
                    <div class="text-h6">Sucursal Principal</div>
                    <div class="row">
                      <q-select class="col" dense v-model="change.item.store" :options="filter.branches.opts"
                        option-label="name" label="Sucursal" filled :disable="true" />
                      <q-separator spaced inset vertical dark />
                      <q-icon name="trending_flat" size="lg" />
                      <q-separator spaced inset vertical dark />
                      <q-select class="col" dense v-model="change.l[0]" :options="filter.branches.opts"
                        option-label="name" label="Sucursal" filled :disable="true" />
                    </div>
                    <div class="text-h6">Sucursales</div>
                    <q-option-group v-model="filter.branches.val" :options="filter.branches.opts" color="primary"
                      type="toggle" @update:model-value="changework(filter.branches.val)" />
                  </q-tab-panel>
                  <q-tab-panel name="positions">
                    <q-select dense option-label="name" v-model="change.item.rol.area" :options="filter.area.opts"
                      label="Area" filled />
                    <q-separator spaced inset vertical dark />
                    <q-select dense option-label="name" v-model="change.item.rol" :options="filpos" label="Puesto"
                      filled />
                  </q-tab-panel>

                  <q-tab-panel name="apps">
                    <div class="text-h6">Apps</div>
                    <q-option-group v-model="filter.apps.val" :options="filter.apps.opts" color="primary" type="toggle"
                      @update:model-value="changeapps(filter.apps.val)" />
                  </q-tab-panel>
                </q-tab-panels>
              </template>
            </q-splitter>
          </q-card-section>
          <q-card-actions align="right">
            <q-btn flat label="Cancelar" color="negative" @click="reset"/>
            <q-btn flat label="Continuar" color="positive" @click="afterDrop" />
          </q-card-actions>
      </q-card>
    </q-dialog>




  </q-page>
</template>

<script setup>
import { BaseTransition, ref, computed } from "vue";
import { useQuasar } from "quasar";
import uapi from "src/API/UserApi";
import viewUser from 'src/components/Users/Index/UserView.vue';
const $q = useQuasar();

const users = ref(null);
const branch = ref(null);
const splitter = ref(25)
const filter = ref({
  status: { val: null, opts: null },
  branches: { val: [], opts: null },
  area: { val: null, opts: null },
  position: { val: null, optsdb: null, opts: [] },
  apps: { val: [], opts: null }
});
const tab2 = ref('workpoints')
const change = ref({
  item: null,
  l: null
});
const getlist = (list) => {
  return users.value.filter((e) => e._store == list);
};
const drop = ref(false);
const table = ref({
  pagination: { rowsPerPage: [0] }
})

const filpos = computed(() => filter.value.position.optsdb.filter((e) => e._area == change.value?.item.rol.area.id))
const startDrag = (e, i) => {
  console.log(i);
  e.dataTransfer.dropEffect = "move";
  e.dataTransfer.effectAllowed = "move";
  e.dataTransfer.setData("itemID", i.id);
};

const onDrop = async (e, l) => {
  const itemID = e.dataTransfer.getData("itemID");
  const item = users.value.find((user) => user.id == itemID);
  console.log(item._store);
  console.log(item.id);
  console.log(item);
  change.value.item = item
  change.value.l = branch.value.filter(b => b.id == l)
  change.value.item.use_store.map(e => e._store == l ? e._state = 1 : e._state = 2)
  filter.value.branches.opts.forEach(e => e.value == l ? e.disable = true : e.disable = false )
  item.apps.forEach(e => filter.value.apps.val.push(e._app))
  filter.value.branches.val.push(l)
  drop.value = true
};

const afterDrop = async () => {

  let mod = {
    user: change.value.item,
    store: change.value.l[0].id,
  };
  console.log(mod);

  const resp = await uapi.changework(mod);
  if (resp.error) {
    console.log(resp);
  } else {
    console.log(resp);
    let inx = users.value.findIndex((user) => user.id == change.value.item.id);
    console.log(inx);
    users.value[inx]._store = change.value.l[0].id;
    $q.notify({
      type: "positive",
      message: `El usurio ${resp.nick} se cambio a la sucursal ${change.value.item.alias}`,
      position: "center"
    });
    drop.value = false
    reset();
  }
}

const changework = (v) => {
  console.log(v);
  v.forEach((e) => {
    let inx = change.value.item.use_store.findIndex(((i) => i._store == e))
    if (inx !== -1) {
      change.value.item.use_store[inx]._state = 1
    }
  })
  change.value.item.use_store = change.value.item.use_store.filter((e) => {
    return v.includes(e._store) || (e._state = 2);
  });
}

const changeapps = (v) => {
  change.value.item.apps
    .filter((existingApp) => !v.includes(existingApp._app))
    .map((appToRemove) => appToRemove._app);
  change.value.item.apps = change.value.item.apps.filter((existingApp) => v.includes(existingApp._app));
  v.forEach((e) => {
    let inx = change.value.item.apps.findIndex((i) => i._app == e)
    if (inx !== -1) {

    } else {
      let app = { _user: change.value.item.id, _app: e }
      change.value.item.apps.push(app)
    }
  })
}

const init = async () => {
  $q.loading.show({ message: "Cargando Usuarios..." });
  const resp = await uapi.workus();
  if (resp.error) {
    console.log(resp);
  } else {
    console.log(resp);
    users.value = resp.users;
    filter.value.area.opts = resp.area
    filter.value.position.optsdb = resp.position
    filter.value.branches.opts = resp.workpoints
    filter.value.apps.opts = resp.apps
    branch.value = resp.branches;
    $q.loading.hide()
  }
};

const reset = () => {
  tab2.value = 'workpoints'
  drop.value = false
  filter.value.status.val = null;
  filter.value.branches.val = [];
  filter.value.area.val = null;
  filter.value.position.val = null;
  filter.value.apps.val = [];
}

init();
</script>
