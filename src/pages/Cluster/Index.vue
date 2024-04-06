<template>
  <q-page padding>

    <div class="row">
      <div class="col">
        <div class="q-pa-md row items-start q-gutter-md">
          <q-card class="my-card" style="width: 300px;">
            <q-card-section class=" text-primary row">

              <div class="text-h5 text-center col"><q-icon name="person" /> Usuarios</div>
              <q-card-actions vertical align="left">
                <q-btn class="col" color="grey" round flat dense
                  :icon="expanded ? 'keyboard_arrow_up' : 'keyboard_arrow_down'" @click="expanded = !expanded" />
              </q-card-actions>
            </q-card-section>

            <q-slide-transition>
              <div v-show="expanded">
                <q-separator />
                <q-card-section class="text-subtitle2">
                  <div v-for="(men, index) in menu" :key="index">
                    <div class="q-pa-sm"></div>
                    <q-btn :color="men.color" :icon="men.icon" :label="men.name" style="width: 250px;"
                      @click="tousers(men.to)" />
                  </div>
                </q-card-section>
              </div>
            </q-slide-transition>
          </q-card>
        </div>
      </div>


      <div class="col">
        <div class="q-pa-md row items-start q-gutter-md">
          <q-card class="my-card" style="width: 300px;">
            <q-card-section class=" text-primary row">

              <div class="text-h5 text-center col"><q-icon name="store" />Sucursales</div>
              <q-card-actions vertical align="left">
                <q-btn class="col" color="grey" round flat dense
                  :icon="expandedst ? 'keyboard_arrow_up' : 'keyboard_arrow_down'" @click="expandedst = !expandedst" />
              </q-card-actions>
            </q-card-section>

            <q-slide-transition>
              <div v-show="expandedst">
                <q-separator />
                <q-card-section class="text-subtitle2">
                  <div v-for="(men, index) in menustores" :key="index">
                    <div class="q-pa-sm"></div>
                    <q-btn :color="men.color" :icon="men.icon" :label="men.name" style="width: 250px;"
                      @click="tousers(men.to)" />
                  </div>
                </q-card-section>
              </div>
            </q-slide-transition>
          </q-card>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
const $router = useRouter();

const expanded = ref(false);
const expandedst = ref(false);


const menu = [
  { id: 1, name: "Usuarios", icon: "person", color: "primary", to: 'usuarios' },
  { id: 2, name: "Crear Usuario", icon: "person_add", color: "primary", to: 'usuarios/create' },
  { id: 3, name: "Equipos", icon: "diversity_3", color: "primary", to: 'usuarios/branch' },
]

const menustores = [
  { id: 1, name: "Sucursal", icon: "store", color: "primary", to: 'stores' },
  { id: 2, name: "Crear Sucursal", icon: "add_business", color: "primary", to: 'stores/create' },
]

const tousers = (to) => {
  console.log(to);
  $router.replace(`/cluster/${to}`);
}

</script>
