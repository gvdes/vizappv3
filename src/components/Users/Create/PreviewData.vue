<template>
  <q-card class="my-card">
    <q-card-section class="text-center bg-primary text-white text-weight-medium">
      <div>
        <q-avatar size="150px">
          <q-img :src="addPersonImage" />
        </q-avatar>
      </div>
      <div class="text-h4 text-center">{{ personaldata.name + ' ' + personaldata.surnames }}</div>
      <div class="text-center">
        <q-badge color="white" class="text-center text-primary">
          {{ personaldata.nick }}
        </q-badge>
      </div>
    </q-card-section>
    <div class="row">
      <div class="col" style="">
        <q-card-section>
          <div class="text-h4 text-center text-white bg-primary"> Informacion Personal </div>
        </q-card-section>
        <q-card-section>
          <div class="text-subtitle1 row">
            <div class="col"> Correo : </div>
            <div class="col"> {{ personaldata.email }}</div>
          </div>
          <q-separator />
          <div class="text-subtitle1 row">
            <div class="col"> Telefono : </div>
            <div class="col"> {{ personaldata.celphone }}</div>
          </div>
          <q-separator />
          <div class="text-subtitle1 row">
            <div class="col"> Fecha Nac: </div>
            <div class="col"> {{ personaldata.dayofbirth.val }}</div>
          </div>
          <q-separator />
          <div class="text-subtitle1 row">
            <div class="col"> Genero : </div>
            <div class="col"> {{ personaldata.gender.val }}</div>
          </div>
        </q-card-section>
      </div>
      <div class="col" style="">
        <q-card-section>
          <div class="text-h4 text-center text-white bg-primary"> Informacion Laboral </div>
        </q-card-section>
        <q-card-section>
          <div class="text-subtitle1 row">
            <div class="col"> Area : </div>
            <div class="col"> {{ area }}</div>
          </div>
          <q-separator />
          <div class="text-subtitle1 row">
            <div class="col"> Puesto : </div>
            <div class="col"> {{ pos }}</div>
          </div>
          <q-separator />
          <div class="text-subtitle1 row">
            <div class="col"> Sucursal : </div>
            <div class="col"> {{ work }}</div>
          </div>
          <q-separator />
          <div class="text-subtitle1 row">
            <div class="col"> Apps : </div>
            <div class="col"> {{ appis }}</div>
          </div>
        </q-card-section>
      </div>
    </div>

    <q-card-section>
      <div class="text-h4 text-center text-white bg-primary"> Documentacion</div>
    </q-card-section>
    <div class="row">
      <div class="col" style="">
        <div v-for="(fil, index) in files.slice(0, 6)" :key="index">
          <q-card-section>
            <div class="text-subtitle1 row">
              <div class="col"> {{ fil.label }}: </div>
              <div class="col">{{ fil.val != null ? "OK" : '' }}</div>
            </div>
            <q-separator />
          </q-card-section>
        </div>
      </div>
      <div class="col" style="">
        <div v-for="(fil, index) in files.slice(6, 11)" :key="index">
          <q-card-section>
            <div class="text-subtitle1 row">
              <div class="col"> {{ fil.label }}: </div>
              <div class="col">{{ fil.val != null ? "OK" : '' }}</div>
            </div>
            <q-separator />
          </q-card-section>
        </div>
      </div>

    </div>
  </q-card>


  <div>
    <q-btn unelevated rounded class="full-width" label="Enviar" type="submit" color="primary" :loading="loading" />
  </div>
</template>

<script setup>
defineProps({
  addPersonImage: { type: String },
  personaldata: { type: Object },
  area: { type: String },
  pos: { type: String },
  work: { type: String },
  appis: { type: String },
  files: { type: Array },
  loading: { type: Boolean }
})

</script>
