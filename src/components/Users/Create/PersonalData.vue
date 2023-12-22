<template>
  <q-card class="my-card">
    <q-card-section class="my-card text-primary bg-white">
      <div class="text-h4">
        <q-icon name="person" class="q-mr-xs" />
        Datos Personales
      </div>
    </q-card-section>
    <q-card-section>
      <q-input rounded outlined v-model="personaldata.name" type="text" label="Nombre(s)" class="q-my-md" />
      <q-input rounded outlined v-model="personaldata.surnames" type="text" label="Apellidos" class="q-my-md" />
      <div class="row q-my-md">

        <q-input rounded outlined v-model="personaldata.dayofbirth.val" label="Fecha Nacimiento" class="col"
          mask="####-##-##" :error="!valifecha" error-message="anio-mes-dia alguno esta mal :(">
          <template v-slot:prepend>
            <q-btn color="primary" icon="event" @click="date = !date" flat round />
          </template>
        </q-input>

        <q-dialog v-model="date">
          <q-date v-model="personaldata.dayofbirth.val" minimal mask="YYYY-MM-DD" />
        </q-dialog>

        <q-input rounded outlined v-model="personaldata.email" type="text" label="Correo Electronico" class="col"
          error-message="El correo ya esta en uso" :error="isValid" />
        <q-input rounded outlined v-model="personaldata.celphone" type="text" label="Telefono" mask="##-####-####"
          class="col" error-message="El numero de telefono ya esta en uso" :error="celvalid" />
      </div>
      <q-btn-toggle v-model="personaldata.gender.val" spread style="border: 1px solid #1c105a;" rounded unelevated
        toggle-color="primary" color="white" text-color="primary" :options="personaldata.gender.opts" />
      <q-input rounded outlined v-model="personaldata.nick" type="text" label="Nick(alias)" class="q-my-md"
        error-message="El nick ya esta en uso" :error="nickvalid" />
    </q-card-section>
  </q-card>
</template>

<script setup>
defineProps({
  personaldata: { type: Object },
  date: { type: Boolean },
  valifecha: { type: Boolean },
  isValid: { type: Boolean },
  celvalid: { type: Boolean },
  nickvalid: { type: Boolean },
})

</script>
