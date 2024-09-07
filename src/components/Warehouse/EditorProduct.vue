<template>
  <q-card class="my-card">
    <q-card-section>
      <div class="text-h6 text-right">{{ product?.short_code }}</div>
    </q-card-section>
    <!-- <q-card-section class="text-center">
      imagen
    </q-card-section> -->
    <q-separator />
    <q-card-section horizontal>
      <q-card-section class="col">
        <div class="text-h4 q-py-md">{{ product?.code }}</div>
        <div class="text-grey-7">ID: {{ product?.id }}</div>
        <div>{{ product?.description }}</div>

        <q-separator spaced/>

        <q-list dense separator>
          <q-item>
            <q-item-section>Codigo de barras</q-item-section>
            <q-item-section>{{ product?.barcode }}</q-item-section>
          </q-item>

          <q-item>
            <q-item-section>Piezas / Caja</q-item-section>
            <q-item-section>{{ product?.pieces }}</q-item-section>
          </q-item>

          <q-item>
            <q-item-section>Estado en Catalogo</q-item-section>
            <q-item-section>{{ product?.state.name }}</q-item-section>
          </q-item>

          <q-item>
            <q-item-section>Unidad de surtido</q-item-section>
            <q-item-section>{{ product?.unitsupply.name }}</q-item-section>
          </q-item>

          <q-item>
            <q-item-section>Categoria</q-item-section>
            <q-item-section>{{ product?.category.name }}</q-item-section>
          </q-item>
        </q-list>
      </q-card-section>

      <q-separator vertical />

      <q-card-section class="col">
        <q-list separator dense>
          <q-item>
            <q-item-section>Stock actual</q-item-section>
            <q-item-section>{{ product?.stock._current }}</q-item-section>
          </q-item>

          <q-item>
            <q-item-section>Stock disponible</q-item-section>
            <q-item-section>{{ product?.stock.available }}</q-item-section>
          </q-item>

          <q-item>
            <q-item-section>Reservado</q-item-section>
            <q-item-section>{{ product?.stock.reserved }}</q-item-section>
          </q-item>

          <q-item>
            <q-item-section>Por llegar</q-item-section>
            <q-item-section>{{ product?.stock.in_coming }}</q-item-section>
          </q-item>
        </q-list>

        <q-separator spaced/>
        <q-list separator>
          <q-item>
            <q-item-section>Estado en almacen</q-item-section>
            <q-item-section> <q-select v-model="form.state.val" :options="form.state.options" filled dense /> </q-item-section>
          </q-item>

          <q-item>
            <q-item-section>Stock Minimo</q-item-section>
            <q-item-section> <q-input flat v-model="form.min" min="1" type="number" filled dense/> </q-item-section>
          </q-item>

          <q-item>
            <q-item-section>Stock Maximo</q-item-section>
            <q-item-section> <q-input flat v-model="form.max" min="1" type="number" filled dense/> </q-item-section>
          </q-item>
        </q-list>

        <template v-if="changesFormDetector">
          <div class="q-pt-md text-center">
            <q-btn color="primary" icon="check" label="Aplicar" @click="applyChanges" :loading="form.saving" :disable="form.saving"/>
          </div>
        </template>
      </q-card-section>
    </q-card-section>

    <!-- <q-card-section>
      <pre>{{ product }}</pre>
    </q-card-section> -->

  </q-card>
</template>

<script setup>
  import { ref, computed } from 'vue';

  let form = ref({
    min:0,
    max:0,
    state:{
      val:null,
      options:[
        { value:1,label:"Disponible"},
        { value:3,label:"Bloqueado"}
      ]
    },
    saving:false
  });

  let $props = defineProps({
    product:{type:Object, default:{}}
  });

  let $emit = defineEmits(["setMinMaxState"]);

  let product = ref($props.product);

  const updateData = () => {
    console.log("Guardando");
  }

  const changesFormDetector = computed(() =>
    `${product.value.stock._min}_${product.value.stock._max}_${product.value.stock.state.id}` !=
    `${form.value.min}_${form.value.max}_${form.value.state.val.value}`
  );

  const applyChanges = () => {

    form.value.saving = true;

    let data = {
      product:product.value.id,
      min:parseInt(form.value.min),
      max:parseInt(form.value.max),
      state:form.value.state.val.value
    }

    $emit("setMinMaxState", data);
  }

  form.value.min = product.value.stock._min;
  form.value.max = product.value.stock._max;
  form.value.state.val = { value: product.value.stock.state.id, label:product.value.stock.state.name };

</script>
