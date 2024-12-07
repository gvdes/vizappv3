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

        <q-input rounded outlined v-model="personaldata.dayofbirth.val" type="date"   class="col" hint="Fecha de Nacimiento"/>
                <q-input rounded outlined v-model="personaldata.email" type="text" label="Correo Electronico" class="col"
          error-message="El correo ya esta en uso" :error="isValid" />
        <q-input rounded outlined v-model="personaldata.celphone" type="text" label="Telefono" mask="##-####-####"
          class="col" error-message="El numero de telefono ya esta en uso" :error="celvalid" />
      </div>
      <q-btn-toggle v-model="personaldata.gender.val" spread style="border: 1px solid #1c105a;" rounded unelevated
        toggle-color="primary" color="white" text-color="primary" :options="personaldata.gender.opts" />
      <q-input rounded outlined v-model="personaldata.nick" type="text" label="Nick(alias)" class="q-my-md"
        error-message="El nick ya esta en uso" :error="nickvalid" />
      <!-- {{ personaldata.avatar }} -->
        <q-uploader
        hide-upload-btn
        label="Fotografia"
        color="primary"
        accept="image/*"
        @added="insertImage"
        @removed="() => personaldata.avatar = null"
        class="full-width"
      />

    </q-card-section>
  </q-card>
</template>

<script setup>

const props = defineProps({
  personaldata: { type: Object },
  date: { type: Boolean },
  valifecha: { type: Boolean },
  isValid: { type: Boolean },
  celvalid: { type: Boolean },
  nickvalid: { type: Boolean },
})

const insertImage = (file) => {
  // console.log(file)
  // props.personaldata.avatar = file[0];
  if (file.length > 0) {
    props.personaldata.avatar = {
      file: file[0],
      url: URL.createObjectURL(file[0])
    };
  }
}

</script>
