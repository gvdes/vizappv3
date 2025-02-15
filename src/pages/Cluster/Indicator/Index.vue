<template>
  <q-page padding>

    <div class="q-pa-sm row items-center text-center text-h6">
      <q-btn flat rounded icon="filter_alt">
        <q-menu max-height="300px">
          <q-card class="my-card">
            <q-card-section>
              <q-select style="min-width: 200px" v-model="filter.class.val" :options="classifications"
                label="Clasificacion" option-label="name" filled>
                <template v-slot:after>
                  <q-btn round dense flat icon="close" @click="filter.class.val = null" />
                </template>
              </q-select>
              <q-separator spaced inset vertical dark />
              <q-select style="min-width: 200px" v-model="filter.branches.val" :options="stores" label="Sucursal"
                :option-label="i => (i.store.name)" filled>
                <template v-slot:after>
                  <q-btn round dense flat icon="close" @click="filter.branches.val = null" />
                </template>
              </q-select>
            </q-card-section>
          </q-card>
        </q-menu>
      </q-btn>
      <q-input v-model="search" type="text" label="Buscar"> <template v-slot:prepend><q-icon
            name="search" /></template></q-input>
      <div class="col anek-bld text-grey-9 q-pl-sm">Clasificacion Colaboradores</div>
      <div>
        <q-btn icon="download" flat rounded />
        <q-btn icon="picture_as_pdf" flat rounded @click="pdfCreate" />
        <q-btn flat rounded icon="autorenew" @click="init" />
      </div>
    </div>


    <div class="q-pa-md row items-start q-gutter-s">
      <div v-for="(use, index) in usuarios" :key="index">
        <q-list>
          <q-item clickable v-ripple @click="editUser(use)">
            <q-item-section>
              <q-card flat class="mycard" bordered
                :style="`width: 250px; max-width: 230vw; height: 400px; border: 2px solid ${color(use)};`">
                <q-card-section>
                  <div class="text-subtitle1 text-center">{{ use.name.toUpperCase() }}
                  </div>
                  <div class="text-subtitle2 text-center"> {{ use.surnames.toUpperCase() }}
                    <div>
                      <q-badge color="primary">
                        {{ use.nick }}
                      </q-badge>
                    </div>
                  </div>
                  <q-separator spaced inset vertical dark />
                  <div class="row">
                    <div class="col">Sucursal:</div>
                    <div class="col"> {{ use.classification?.store.store.name }} </div>
                  </div>

                  <q-separator spaced inset vertical dark />
                  <div class="row">
                    <div class="col">Puesto:</div>
                    <div class="col"> {{ use.rol.name }}</div>
                  </div>
                  <q-separator spaced inset vertical dark />
                  <div class="row q-mt-md">
                    <div class=" col">Clasificacion:</div>
                    <div class=" col text-bold text-h4">{{ use.classification?.classification.name }}</div>
                  </div>
                  <q-separator spaced inset vertical dark />
                  <div class="flex justify-center" v-if="use.avatar">
                    <q-avatar size="170px"> <q-img :src="`${vizmedia}/profiles/${use.id}/${use.avatar}`" /> </q-avatar>
                  </div>
                  <!-- <div class="flex justify-center" v-else>
                  <q-avatar size="170px"> <q-img :src="`src/assets/avatares/pokesnorlax.png`" /> </q-avatar>
                </div> -->
                </q-card-section>
              </q-card>
            </q-item-section>
          </q-item>
        </q-list>
      </div>
    </div>


    <q-dialog v-model="viewUser.state" persistent>
      <q-card style="width: 300px">
        <q-card-section>
          <div class="flex justify-center">
            <q-avatar size="170px"> <q-img :src="`${vizmedia}/profiles/${viewUser.val.id}/${viewUser.val.avatar}`" />
            </q-avatar>
          </div>
        </q-card-section>
        <q-card-section>
          <div class="text-h6 text-center">{{ viewUser.val.name.toUpperCase() + ' ' +
            viewUser.val.surnames.toUpperCase() }}</div>
          <div class="flex justify-center">
            <q-badge color="primary">
              {{ viewUser.val.nick }}
            </q-badge>
          </div>
        </q-card-section>
        <q-card-section class="items-center">
          <q-select v-model="viewUser.val.classification.classification" :options="classifications"
            label="Clasificacion" filled option-label="name" />
          <q-separator spaced inset vertical dark />
          <q-select v-model="viewUser.val.classification.store" :options="stores" label="Sucursal de Clasificacion"
            filled :option-label="i => (`${i.store.name} (${i.clasification.name}) `)">
            <template v-slot:option="scope">
              <q-item v-bind="scope.itemProps">
                <q-item-section>
                  <q-item-label>{{ scope.opt.store.name }}</q-item-label>
                  <q-item-label caption>{{ scope.opt.clasification.name }}</q-item-label>
                </q-item-section>
              </q-item>
            </template>
          </q-select>
        </q-card-section>
        <q-card-section>
          <q-list>
            <q-item>
              <q-item-section>
                <q-item-label class="text-center">Bono Total</q-item-label>
                <q-item-label class="text-center text-bold text-subtitle1">
                  <q-btn flat size="lg" :label="`$ ${(viewUser.val.classification.classification.percentage / 100) *
                    (viewUser.val.classification.import) * 4}`" @click="changeValue = !changeValue" />
                </q-item-label>
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section>
                <q-item-label class="text-center">Bono Semanal</q-item-label>
                <q-item-label class="text-center text-bold text-subtitle1">$
                  {{ (viewUser.val.classification.classification.percentage / 100) *
                    (viewUser.val.classification.import / 2) }} </q-item-label>
              </q-item-section>
              <q-item-section>
                <q-item-label class="text-center">Bono Mensual</q-item-label>
                <q-item-label class="text-center text-bold text-subtitle1">$ {{
                  ((viewUser.val.classification.classification.percentage / 100) *
                    (viewUser.val.classification.import / 2)) * 4 }} </q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat icon="close" color="negative" v-close-popup />
          <q-btn flat icon="check" color="positive" @click="validChange" :disable="detectedChange" />
        </q-card-actions>
      </q-card>

    </q-dialog>

    <q-dialog v-model="changeValue" persistent>
      <q-card>
        <q-card-section class="items-center">
          <span class="text-center text-bold text-h5">
            Cambio total de bono
            <div class="text-overline">Semanal</div>
          </span>

        </q-card-section>
        <q-card-section>
          <q-input v-model="viewUser.val.classification.import" type="number" label="Importe"
            :error="viewUser.val.classification.import.length <= 0" filled />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat icon="close" color="negative" v-close-popup />
          <q-btn flat icon="check" color="positive" @click="changeBonus" />
        </q-card-actions>
      </q-card>
    </q-dialog>


    <q-dialog v-model="prop" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="warning" color="warning" text-color="black" />
          <span class="q-ml-sm text-bold text-center">Deseas ajustar el importe de el bono a como esta en la
            sucursal?</span>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="negative" v-close-popup />
          <q-btn flat label="No" color="warning" @click="editColaboratorStore(false)" />
          <q-btn flat label="Si" color="positive" @click="editColaboratorStore(true)" />
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

  </q-page>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useAccountStore } from 'stores/Account';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import indpi from 'src/API/IndicatorApi';
import pdf from 'src/PDF/Indicators/userclass.js';
import { vizmedia } from 'boot/axios'
const piniaAccount = useAccountStore();
const $q = useQuasar();
const $router = useRouter();

const users = ref([]);
const classifications = ref([]);
const stores = ref([])
const search = ref('');
const changeValue = ref(false);
const prop = ref(false);

const viewUser = ref({
  state: false,
  val: null
})

const filter = ref({
  state: false,
  class: { val: null, opts: null },
  branches: { val: null, opts: null },
});

const week = ref(null);

const userList = computed(() => {
  if (!filter.value.class.val && !filter.value.branches.val) {
    return users.value;
  } else {
    return users.value.filter((e) => {
      const statusId = filter.value.class?.val?.id;
      const branchesId = filter.value.branches?.val?.id;

      const isStatusSelected = statusId != null;
      const isBranchesSelected = branchesId != null;

      return (
        (isStatusSelected || isBranchesSelected) &&
        e.classification?.store?.id != null && // Verifica si `store.id` existe
        e.classification?.classification?.id != null && // Verifica si `classification.id` existe
        (isStatusSelected ? e.classification.classification.id == statusId : true) &&
        (isBranchesSelected ? e.classification.store.id == branchesId : true)
      );
    });
  }
});

const usuarios = computed(() => userList.value.filter(e => (e.name + e.surnames).toLowerCase().includes(search.value.toLowerCase())))

const isMobile = computed(() => $q.platform.is.mobile);
const permissions = computed(() => piniaAccount.account.modules.filter((e) => e.module.root == 'v76v'))


const changeClassifications = computed(() => JSON.stringify(users.value.filter(e => e.id == viewUser.value.val.id)[0].classification.classification) == JSON.stringify(viewUser.value.val.classification.classification));
const changeBranch = computed(() => JSON.stringify(users.value.filter(e => e.id == viewUser.value.val.id)[0].classification.store) == JSON.stringify(viewUser.value.val.classification.store))
const detectedChange = computed(() => JSON.stringify(users.value.filter(e => e.id == viewUser.value.val.id)[0]) == JSON.stringify(viewUser.value.val))

const init = async () => {
  $q.loading.show({ message: 'Obteniendo colaboradores' });
  const resp = await indpi.getUserClass();
  if (resp.error) {
    console.log(resp.error)
  } else {
    users.value = resp.users;
    classifications.value = resp.classifications
    stores.value = resp.stores
    week.value = resp.week
    $q.loading.hide();

    console.log(resp);
  }
}

const editUser = (user) => {

  viewUser.value.state = true
  viewUser.value.val = JSON.parse(JSON.stringify(user))
}

const validChange = () => {
  if (!changeClassifications.value && !changeBranch.value) {
    console.log('SE MODIFICARON LOS DOS');
    editColaboratorClassification()
    prop.value = !prop.value;

  } else if (!changeClassifications.value && changeBranch.value) {
    console.log('Solo se modifico la clasificacion')
    editColaboratorClassification()
  } else if (!changeBranch.value && changeClassifications.value) {
    console.log('solo se modifico la sucursal')
    prop.value = !prop.value;

  }

}


const color = (e) => {
  if (e.classification?._classification == 1) {
    return 'green' // azul
  } else if (e.classification?._classification == 2) {
    return 'yellow' // verde
  } else if (e.classification?._classification == 3) {
    return 'red' //naranja
  }
}

const editColaboratorClassification = async () => {
  console.log(viewUser.value.val.classification)
  $q.loading.show({ message: 'Editando Clasificacion' });
  const resp = await indpi.editUserClass(viewUser.value.val.classification)
  if (resp.error) {
    console.log(resp);

  } else {
    console.log(resp)
    let inx = users.value.findIndex(e => e.id == resp.id);
    users.value[inx] = resp
    $q.loading.hide();
    if (changeBranch.value) {
      viewUser.value.state = false
    }
  }
}

const editColaboratorStore = async (change) => {
  viewUser.value.val.classification.chBonus = change
  console.log(viewUser.value.val.classification)
  $q.loading.show({ message: 'Editando Sucursal' })
  const resp = await indpi.editUserStore(viewUser.value.val.classification)
  if (resp.error) {
    console.log(resp);
  } else {
    console.log(resp)
    let inx = users.value.findIndex(e => e.id == resp.id);
    users.value[inx] = resp
    $q.loading.hide();
    viewUser.value.state = false
    prop.value = !prop.value
  }
}

const changeBonus = async () => {
  $q.loading.show({ message: 'Modificando Bono' })
  console.log(viewUser.value.val.classification)
  const resp = await indpi.changeUserBonues(viewUser.value.val.classification)
  if (resp.error) {
    console.log(resp);
  } else {
    console.log(resp)
    changeValue.value = false
    viewUser.value.state = false
    $q.loading.hide()
  }
}

const pdfCreate = () => {
  let sucursales = new Map();
  usuarios.value.forEach(user => {

    if (user.classification?.store) {
      let store = user.classification.store;
      let storeId = store.id;
      if (!sucursales.has(storeId)) {
        sucursales.set(storeId, { ...store, users: [] });
      }
      sucursales.get(storeId).users.push(user);
    }
  });
  let sucursalesArray = [...sucursales.values()];
  pdf.firmasPdf(sucursalesArray,week.value)
  pdf.BonsPdf(sucursalesArray,week.value)
}



init()
</script>
