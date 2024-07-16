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
        <div
          class="q-pa-xs col-xs-12 col-sm-6 col-md-4"
          @drop="onDrop($event, props.row.id)"
          @dragenter.prevent
          @dragover.prevent
        >
          <q-card class="my-card" flat>
            <q-card-section>
              <div></div>
              <div class="text-h6 text-white bg-blue-6">
                <q-icon name="store" size="30px" color="white" />{{
                  props.row.name.toUpperCase()
                }}
                ({{ getlist(props.row.id).length }})
                <q-btn
                  color="white"
                  round
                  flat
                  dense
                  :icon="
                    props.expand ? 'keyboard_arrow_up' : 'keyboard_arrow_down'
                  "
                  @click="props.expand = !props.expand"
                />
              </div>
            </q-card-section>
            <q-slide-transition>
              <div v-show="props.expand">
                <div
                  v-for="item in getlist(props.row.id)"
                  :key="item.id"
                  :draggable="true"
                  @dragstart="startDrag($event, item)"
                >
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
    <q-dialog v-model="drop" >
          <q-card>
            <q-card-section class="text-bold text-h6">
              {{ change.item.name }} {{ change.item.surnames }}
            </q-card-section>

            <q-card-section class="text-h6">
              {{ change.item.store.name }}  <q-icon name="trending_flat" />  {{ change.l[0].name }}
            </q-card-section>

            <q-card-actions align="right">
              <q-btn flat label="Cancelar" color="negative" v-close-popup />
              <q-btn flat label="Cambiar" color="positive" @click="afterDrop"/>
            </q-card-actions>
          </q-card>
        </q-dialog>
  </q-page>
</template>

<script setup>
import { BaseTransition, ref } from "vue";
import { useQuasar } from "quasar";
import uapi from "src/API/UserApi";
const $q = useQuasar();

const users = ref(null);
const branch = ref(null);
const expanded = ref(false);
const change = ref({
  item:null,
  l:null
});
const getlist = (list) => {
  return users.value.filter((e) => e._store == list);
};
const drop = ref(false);
const table = ref({
  pagination:{ rowsPerPage: [0]}
})

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
  change.value.item = item
  change.value.l = branch.value.filter(b => b.id == l)
  drop.value = true

  // afterDrop(item,l)
};

const afterDrop = async() => {

  let mod = {
    user: change.value.item.id,
    store: change.value.l[0].id,
  };
  console.log(mod);

  const resp = await uapi.changework(mod);
  if (resp.error) {
    console.log(resp);
  } else {
    console.log(resp);
    let inx = users.value.findIndex((user) => user.id == change.value.item.id);
    users.value[inx]._store = change.value.l[0].id;
    $q.notify({
      type: "positive",
      message: resp,
      position:"center"
    });
    drop.value = false
  }
}

const init = async () => {
  $q.loading.show({ message: "Cargando Usuarios..." });
  const resp = await uapi.workus();
  if (resp.error) {
    console.log(resp);
  } else {
    console.log(resp);
    users.value = resp.users;
    branch.value = resp.branches;
    $q.loading.hide();
  }
};

init();
</script>
