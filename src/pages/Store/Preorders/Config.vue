<template>
  <q-page padding>
		<div class="q-mt-md">
			<q-card class="bg-darkl1">
				<q-card-section class="bg-primary text-white  text-uppercase text--2">modulos</q-card-section>

				<q-list class="text-bold" separator>
					<q-item tag="label" v-ripple  v-for="config in cnf" :key="config._state" >
						<q-item-section>
							<q-item-label>{{config.state.name}}</q-item-label>
							<q-item-label caption class="text-caption">{{ JSON.parse(config.details)[config.active] }}</q-item-label>
						</q-item-section>
						<q-item-section side>
              <q-toggle v-model="config.active" color="primary" :true-value="1" :false-value="0" keep-color @update:model-value="actState(config)" size="md" />
						</q-item-section>
					</q-item>
				</q-list>
			</q-card>
		</div>
  </q-page>
</template>

<script setup>
import { ref, watch, onBeforeMount, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useQuasar, LocalStorage, Loading } from 'quasar';
import { useAccountStore } from 'stores/Account';
import pvtpi from 'src/API/PreordersApi.js'
import { $sktpvt } from 'boot/socket'

const $q = useQuasar();
const $route = useRoute();
const $router = useRouter()
const piniaAccount = useAccountStore();

$sktpvt.connect();

$sktpvt.on('connect', () => {
  console.log('Conectado al servidor')
  $sktpvt.emit('ParametrosConexion', piniaAccount)
});

$sktpvt.on('changeStateConfig', (params)=>{
  // $messag = params.active == 0 ? 'Desactivado' : 'Activado';
  $q.notify({message:`El Proceso ${JSON.parse(params.details)[params.active]} `})
})



const configs = ref([])

const cnf = computed(() => configs.value.filter(e => e.state.require == 0))

const init = async () => {
  const resp = await pvtpi.getConfig();
  if(resp.error){
    console.log(resp)
  }else{
    console.log(resp)
    configs.value = resp
  }

}
const actState = (item) => {
  $q.loading.show({message:'Actualizando Estado'})
  console.log(item)
  const resp = pvtpi.changeConfig(item)
  console.log(resp);
  if(resp.error){
    console.log(resp)
  }else{
    $q.loading.hide()
    console.log(resp)
    $sktpvt.emit('ChangeStateConfig',item);
  }


}

init()

</script>
