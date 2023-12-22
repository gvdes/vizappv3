<template>
  <q-card class="my-card">
    <q-card-section class=" bg-white text-primary">
      <div class="text-h4">
        <q-icon name="person" class="q-mr-xs" />
        Datos Personales
      </div>
    </q-card-section>
    <q-card-section>
      <div class="q-gutter-y-md">
        <q-tabs v-model="tab2" dense class="bg-primary text-white">
          <q-tab name="Rol" icon="lock" label="Rol" class="col" />
          <q-tab name="Sucursales" icon="store" label="Sucursales" class="col" />
          <q-tab name="Apps" icon="app_registration" label="Apps" class="col" />
        </q-tabs>
        <q-tab-panels v-model="tab2" animated>

          <q-tab-panel name="Rol">
            <q-card class="my-card">
              <q-card-section>
                <q-select v-model="roles.areas.val" :options="roles.areas.opts" label="Area" filled option-label="name" />
                <q-separator spaced inset vertical dark />
                <div v-if="roles.areas.val">
                  <q-select v-model="roles.puesto.val" :options="roles.areas.val.roles" label="Puesto" filled
                    class="q-my-md" option-label="name" />
                </div>
              </q-card-section>
            </q-card>
          </q-tab-panel>

          <q-tab-panel name="Sucursales">
            <q-card class="my-card">
              <q-card-section>
                <q-select v-model="workpoints.valfav" :options="workpoints.opts" label="Selecciona Tienda Principal"
                  filled @update:model-value="insfo" />
              </q-card-section>
              <q-card-section>
                <div class="text-h6">Sucursales</div>
                <q-option-group v-model="workpoints.val" :options="workpoints.opts" color="primary" type="toggle" />
              </q-card-section>
            </q-card>
          </q-tab-panel>

          <q-tab-panel name="Apps">
            <q-card class="my-card">
              <q-card-section>
                <div class="text-h6">APPS</div>
                <q-option-group v-model="apps.val" :options="apps.opts" color="primary" type="toggle" />
              </q-card-section>
            </q-card>
          </q-tab-panel>
        </q-tab-panels>
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup>
const props = defineProps({
  tab2: { type: Boolean },
  roles: { type: Object },
  workpoints: { type: Object },
  apps: { type: Object },
})

const insfo = () => {
  props.workpoints.val = [];
  props.workpoints.val.push(props.workpoints.valfav.value)
}
</script>
