<template>
  <div class="q-pa-md row items-start q-gutter-s">
    <div v-for="(use, index) in users" :key="index">
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
                  <div class="col"> {{ use.store.name }} </div>
                </div>
                <q-separator spaced inset vertical dark />
                <div class="row">
                  <div class="col">Area:</div>
                  <div class="col">{{ use.rol.area.name }}</div>
                </div>
                <q-separator spaced inset vertical dark />
                <div class="row">
                  <div class="col">Puesto:</div>
                  <div class="col"> {{ use.rol.name }}</div>
                </div>
                <q-separator spaced inset vertical dark />
                <div class="flex justify-center" v-if="use.avatar">
                  <q-avatar size="170px"> <q-img :src="`src/assets/avatares/${use.avatar}`" /> </q-avatar>
                </div>
                <div class="flex justify-center" v-else>
                  <q-avatar size="170px"> <q-img :src="`src/assets/avatares/pokesnorlax.png`" /> </q-avatar>
                </div>
              </q-card-section>
            </q-card>
          </q-item-section>
        </q-item>
      </q-list>
    </div>
  </div>

  <q-dialog v-model="useEdit.state"  transition-show="rotate" transition-hide="rotate" persistent>
    <viewUser :useEdit="useEdit" @recargar="changeval"/>
  </q-dialog>
</template>

<script setup>
const props = defineProps({ users: { type: Array }, areas: { type: Array }, roles: { type: Array }, branches: { type: Array } })
const emit = defineEmits(['init'])
import viewUser from 'src/components/Users/Index/UserView.vue';
import { ref, computed } from 'vue';
const useEdit = ref({
  state: false,
  body: null
});

const gender = ref({
  val: null, opts: [
    { value: 'M', label: "Masculino" },
    { value: 'F', label: "Femenino" },
    { value: 'I', label: "Indefinido" }
  ]
})
const editUser = (use) => {
  useEdit.value.state = true;
  useEdit.value.body = use;
  gender.value.val = useEdit.value.body.gender
}

const changeval = () =>{
  emit('init')
}

const color = (e) => {
  if (e._state == 1) {
    return '#00337C' // azul
  } else if (e._state == 2) {
    return '#03C988' // verde
  } else if (e._state == 3) {
    return '#E3651D' //naranja
  } else if (e._state == 4) {
    return '#B80000' // rojo
  } else if (e._state == 5) {
    return '#711DB0' // morado
  } else {
    return '#22092C' //negro default
  }
}

</script>
