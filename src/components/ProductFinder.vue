<template>
  <div>
    <div v-if="mode=='std'">
      <q-input rounded outlined dense v-model="target" :type="keyboard" label="Buscar ..." @keypress.enter="search" ref="iptsearch" input-class="text-uppercase">
        <template v-slot:prepend>
          <q-btn dense flat color="primary" :icon="keyboard=='number'? 'abc':'123'" round @click="setKeyboard" />
          <q-btn dense flat icon="bolt" :color="mode=='std' ? 'purple-2':'primary'" round @click="setModeSearch" />
        </template>

        <template v-slot:append >
          <q-btn rounded dense flat :color=" target.length<2 ? 'grey-2':'positive'" icon="search" :disabled="target.length<2" @click="search"/>
        </template>
      </q-input>
    </div>

    <div v-if="mode=='atc'">
      <q-select
        rounded outlined use-input dense
        input-class="text-uppercase"
        label="Buscar producto"
        v-model="target"
        :options="options"
        :type="keyboard"
        @filter="autocomplete"
        @update:model-value="itemTapped"
        input-debounce="600"
        ref="iptsearch"
        option-value="id"
      >
        <template v-slot:prepend>
          <q-btn dense flat color="primary" :icon="keyboard=='number'? 'abc':'123'" round @click="setKeyboard" />
          <q-btn dense flat icon="bolt" :color="mode=='std' ? 'purple-2':'primary'" round @click="setModeSearch" />
        </template>

        <template v-slot:no-option>
          <q-item class="bg-warning text-dark">
            <q-item-section avatar><q-icon name="report" /></q-item-section>
            <q-item-section>Sin coincidencias :(</q-item-section>
          </q-item>
        </template>

        <template v-slot:option="scope">
          <q-item v-bind="scope.itemProps">
            <!-- <q-item-section avatar>
              <q-avatar color="primary" text-color="white" icon="bluetooth" />
            </q-item-section> -->

            <q-item-section>
              <q-item-label caption>ID: {{scope.opt.id}}</q-item-label>
              <q-item-label class="text-h6 anek-bld">{{scope.opt.code}}</q-item-label>
              <q-item-label class="text-h6">{{scope.opt.short_code}}</q-item-label>
              <q-item-label>{{scope.opt.barcode}}</q-item-label>
              <q-item-label caption lines="2">{{scope.opt.description}}</q-item-label>
            </q-item-section>

            <q-item-section side v-if="scope.opt._assoc" class="text-grey-6 anek-bld">
              <q-item-label>{{ scope.opt._assoc }}</q-item-label>
            </q-item-section>
          </q-item>

          <q-separator />
        </template>

      </q-select>
    </div>
  </div>
</template>

<script setup>
  import { ref, nextTick, onBeforeMount, computed } from 'vue';
  import PFinder from 'src/API/PFinder.js';

  /**
   * R E F E R E N C E S
   */
  const iptsearch = ref(null);
  const target = ref("");
  const showpre = ref(true);
  const options = ref([]);
  const props = defineProps({
    keyboard:{type: String, default:"text"},
    mode:{ type: String, default:"atc" },
    warehouse:{ type:Number, default:0 },
    withLocations:{ type:Boolean, default:false },
    withPrices:{ type:Boolean, default:false },
    withMedia:{ type:Boolean, default:false },
  });

  const $emit = defineEmits(["itemtapped"]);

  const mode = ref(props.mode);
  const keyboard = ref(props.keyboard);
  const warehouse = ref(props.warehouse);
  const locations = ref(props.withLocations);
  const prices = ref(props.withPrices);
  const media = ref(props.withMedia);

  /**
   * M E T H O D S
   */
  const setKeyboard = () => {
    target.value = "";
    keyboard.value = keyboard.value=='number' ? 'text':'number';
    nextTick(() => iptsearch.value.focus());
  };

  const setModeSearch = () => {
    target.value = "";
    mode.value = mode.value=='std' ? 'atc':'std'
    nextTick(() => iptsearch.value.focus());
  };

  const search = async (evt) => {
    if(target.value.length>1){
      // console.log(evt);
      const resp = await PFinder.atc(target.value,warehouse.value,locations.value,prices.value,media.value);
      console.log(resp);
    }else{ console.log("nememes... escribe algo!!"); }
  }

  const autocomplete = async (val, update, abort) => {
    let key = val.toUpperCase().trim();
    if (key.length < 4) { abort(); return } else{
      // console.log("Buscando... "+key);
      const resp = await PFinder.atc(key,warehouse.value,locations.value,prices.value,media.value);
      console.log(resp);
      update(() => options.value = resp.items );
    }
  }

  const itemTapped = async (item) => $emit("itemtapped",item);

  // const sendItem = (item) => {
  //   $emit("itemtapped",item);
  // }

  /** C O M P U T E D S */
  //
</script>
